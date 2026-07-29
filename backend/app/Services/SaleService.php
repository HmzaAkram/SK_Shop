<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Installment;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\ValidationException;

class SaleService
{
    /**
     * Create a sale, its line items, deduct stock, and (if applicable)
     * generate the installment schedule — all inside a single DB transaction.
     *
     * @throws ValidationException|\Throwable
     */
    public function createSale(array $data): Sale
    {
        return DB::transaction(function () use ($data) {
            // Try to reuse existing customer by phone OR CNIC to avoid duplicates.
            // Prefer phone match, fall back to CNIC. If none found, create a new customer.
            $customerData = $data['customer'] ?? [];
            $customer = null;

            if (!empty($customerData['phone']) || !empty($customerData['cnic'])) {
                $customerQuery = Customer::query();
                if (!empty($customerData['phone'])) {
                    $customerQuery->where('phone', $customerData['phone']);
                }
                if (!empty($customerData['cnic'])) {
                    $customerQuery->orWhere('cnic', $customerData['cnic']);
                }
                $customer = $customerQuery->first();
            }

            if (!$customer) {
                // create new customer record
                $customerDataToSave = $customerData;
                // Laravel will automatically cast witnesses to JSON if it is in the fillable properties
                $customer = Customer::create($customerDataToSave);
            } else {
                // If the customer exists but didn't have witnesses, we can optionally update them
                if (isset($customerData['witnesses']) && empty($customer->witnesses)) {
                    $customer->update(['witnesses' => $customerData['witnesses']]);
                }
            }

            // Lock the row that holds the highest invoice number to avoid a race
            // condition between two concurrent sales generating the same number.
            $lastSale = Sale::orderBy('id', 'desc')->lockForUpdate()->first();
            $nextNumber = $lastSale ? ((int) $lastSale->invoice_number) + 1 : 1;
            $invoiceNumber = str_pad((string) $nextNumber, 4, '0', STR_PAD_LEFT);

            // Create sale record with placeholder totals; totals will be recomputed server-side
            $sale = Sale::create([
                'customer_id' => $customer->id,
                'invoice_number' => $invoiceNumber,
                'sale_date' => $data['sale_date'],
                'type' => $data['type'],
                'payment_method' => $data['payment_method'] ?? 'Cash',
                'payment_account_id' => $data['payment_account_id'] ?? null,
                'total_amount' => 0,
                'advance_payment' => $data['advance_payment'] ?? 0,
                'total_installments' => $data['total_installments'] ?? null,
                'monthly_installment' => $data['monthly_installment'] ?? null,
                'total_cogs' => 0,
            ]);

            $computedTotal = 0.0;
            $computedCogs = 0.0;

            foreach ($data['items'] as $itemData) {
                // Lock the product row while checking/deducting stock to prevent
                // overselling under concurrent requests.
                $product = Product::lockForUpdate()->findOrFail($itemData['product_id']);

                if ($product->stock < $itemData['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => ["Insufficient stock for product: {$product->name} (available: {$product->stock})"],
                    ]);
                }

                // Server authoritative pricing: use product.selling_price as unit price.
                $unitPrice = (float) $product->selling_price;
                // Allow discount if provided by client (validated) but server recomputes subtotal
                $discount = isset($itemData['discount']) ? (float) $itemData['discount'] : 0.0;
                $quantity = (int) $itemData['quantity'];

                $subtotal = ($unitPrice * $quantity) - ($discount * $quantity);
                if ($subtotal < 0) $subtotal = 0;

                // Cost based on product.real_price
                $costPrice = (float) $product->real_price;
                $totalCost = $costPrice * $quantity;

                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'subtotal' => $subtotal,
                    'cost_price' => $costPrice,
                    'discount' => $discount,
                ]);

                // Reduce stock
                $product->decrement('stock', $quantity);

                $computedTotal += $subtotal;
                $computedCogs += $totalCost;
            }

            // Update sale with computed totals
            $sale->update([
                'total_amount' => $computedTotal,
                'total_cogs' => $computedCogs,
            ]);

            if ($data['type'] === 'Installment' && !empty($data['total_installments'])) {
                $saleDate = Carbon::parse($data['sale_date']);

                for ($i = 1; $i <= $data['total_installments']; $i++) {
                    Installment::create([
                        'sale_id' => $sale->id,
                        'installment_number' => $i,
                        'amount' => $data['monthly_installment'],
                        'due_date' => $saleDate->copy()->addMonths($i)->format('Y-m-d'),
                        'status' => 'Pending',
                    ]);
                }
            }

            return $sale->load(['customer', 'items.product', 'installments']);
        });
    }

    /**
     * Delete a sale: restore product stock, remove related items & installments, then delete the sale.
     * Performed inside a database transaction to ensure consistency.
     */
    public function deleteSale(Sale $sale): void
    {
        DB::transaction(function () use ($sale) {
            // Reload relationships to ensure we have items and their product ids
            $sale->load(['items']);

            foreach ($sale->items as $item) {
                // Lock product row before updating stock
                $product = Product::lockForUpdate()->find($item->product_id);
                if ($product) {
                    $product->increment('stock', $item->quantity);
                }
            }

            // Delete installments and sale items
            $sale->installments()->delete();
            $sale->items()->delete();

            // Finally delete the sale record
            $sale->delete();
        });
    }
}
