<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Installment;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        // Revenue (canonical): sum of sale_items.subtotal
        $totalRevenue = SaleItem::selectRaw('COALESCE(SUM(subtotal),0) as total')->join('sales', 'sale_items.sale_id', '=', 'sales.id')->value('total');
        $totalCogs = SaleItem::selectRaw('COALESCE(SUM(cost_price * quantity),0) as total')->join('sales', 'sale_items.sale_id', '=', 'sales.id')->value('total');

        $totalOrders    = Sale::count();
        $totalCustomers = Customer::count();
        $totalProducts  = Product::count();

        $lowStockProducts = Product::with('category')
            ->whereColumn('stock', '<=', 'alert_stock')
            ->orderBy('stock')
            ->get(['id', 'name', 'stock', 'alert_stock', 'category_id']);

        $overdueInstallments = Installment::with(['sale' => fn ($q) => $q->with('customer')])
            ->where('status', 'Pending')
            ->where('due_date', '<', now()->toDateString())
            ->orderBy('due_date')
            ->get()
            ->map(fn (Installment $i) => [
                'id'             => $i->id,
                'amount'         => (float) $i->amount,
                'due_date'       => $i->due_date,
                'customer_name'  => $i->sale?->customer?->name,
                'customer_phone' => $i->sale?->customer?->phone,
                'invoice_number' => $i->sale?->invoice_number,
                'sale_id'        => $i->sale_id,
            ]);

        $upcomingInstallments = Installment::with(['sale' => fn ($q) => $q->with('customer')])
            ->where('status', 'Pending')
            ->whereBetween('due_date', [now()->toDateString(), now()->addDays(7)->toDateString()])
            ->orderBy('due_date')
            ->get()
            ->map(fn (Installment $i) => [
                'id'             => $i->id,
                'amount'         => (float) $i->amount,
                'due_date'       => $i->due_date,
                'customer_name'  => $i->sale?->customer?->name,
                'customer_phone' => $i->sale?->customer?->phone,
                'invoice_number' => $i->sale?->invoice_number,
                'sale_id'        => $i->sale_id,
            ]);

        return response()->json([
            'total_sales'           => (float) $totalRevenue,
            'total_cogs'            => (float) $totalCogs,
            'total_orders'          => $totalOrders,
            'total_customers'       => $totalCustomers,
            'total_products'        => $totalProducts,
            'low_stock_products'    => $lowStockProducts,
            'overdue_installments'  => $overdueInstallments,
            'upcoming_installments' => $upcomingInstallments,
        ]);
    }
}