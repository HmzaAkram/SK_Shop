<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Installment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SaleController extends Controller
{
    public function index()
    {
        return response()->json(Sale::with(['customer', 'items.product', 'installments'])->latest()->get());
    }

    public function show(Sale $sale)
    {
        return response()->json($sale->load(['customer', 'items.product', 'installments']));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer' => 'required|array',
            'customer.name' => 'required|string',
            'customer.phone' => 'required|string',
            'customer.cnic' => 'nullable|string',
            'customer.address' => 'nullable|string',
            'customer.guarantor_name' => 'nullable|string',
            'customer.guarantor_phone' => 'nullable|string',
            'customer.guarantor_cnic' => 'nullable|string',

            'sale_date' => 'required|date',
            'type' => 'required|in:Cash,Installment',
            'total_amount' => 'required|numeric',
            'advance_payment' => 'nullable|numeric',
            'total_installments' => 'nullable|integer',
            'monthly_installment' => 'nullable|numeric',

            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric',
            'items.*.subtotal' => 'required|numeric',
        ]);

        try {
            DB::beginTransaction();

            // Find or Create Customer by Phone
            $customer = Customer::firstOrCreate(
                ['phone' => $validated['customer']['phone']],
                $validated['customer']
            );

            // Generate sequential invoice number (0001, 0002, ...)
            $lastSale = Sale::orderBy('id', 'desc')->first();
            $nextNumber = $lastSale ? intval($lastSale->invoice_number) + 1 : 1;
            $invoiceNumber = str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

            // Create Sale
            $sale = Sale::create([
                'customer_id' => $customer->id,
                'invoice_number' => $invoiceNumber,
                'sale_date' => $validated['sale_date'],
                'type' => $validated['type'],
                'total_amount' => $validated['total_amount'],
                'advance_payment' => $validated['advance_payment'] ?? 0,
                'total_installments' => $validated['total_installments'],
                'monthly_installment' => $validated['monthly_installment'],
            ]);

            // Add Items and Deduct Stock
            foreach ($validated['items'] as $itemData) {
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $itemData['product_id'],
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $itemData['unit_price'],
                    'subtotal' => $itemData['subtotal'],
                ]);

                // Deduct Stock
                $product = Product::findOrFail($itemData['product_id']);
                if ($product->stock < $itemData['quantity']) {
                    throw new \Exception("Insufficient stock for product: {$product->name}");
                }
                $product->decrement('stock', $itemData['quantity']);
            }

            // Auto-generate installment records if type is Installment
            if ($validated['type'] === 'Installment' && !empty($validated['total_installments'])) {
                $monthlyAmount = $validated['monthly_installment'];
                $totalInstallments = $validated['total_installments'];
                $saleDate = Carbon::parse($validated['sale_date']);

                for ($i = 1; $i <= $totalInstallments; $i++) {
                    Installment::create([
                        'sale_id' => $sale->id,
                        'installment_number' => $i,
                        'amount' => $monthlyAmount,
                        'due_date' => $saleDate->copy()->addMonths($i)->format('Y-m-d'),
                        'status' => 'Pending',
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Sale created successfully',
                'data' => $sale->load(['customer', 'items.product', 'installments'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create sale',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
