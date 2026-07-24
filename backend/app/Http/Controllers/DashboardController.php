<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use App\Models\Customer;
use App\Models\Installment;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        $totalSales = Sale::sum('total_amount');
        $totalOrders = Sale::count();
        $totalCustomers = Customer::count();
        $totalProducts = Product::count();

        // Low stock products (stock <= 5)
        $lowStockProducts = Product::where('stock', '<=', 5)->get(['id', 'name', 'stock']);

        // Overdue installments
        $overdueInstallments = Installment::with('sale.customer')
            ->where('status', 'Pending')
            ->where('due_date', '<', now()->format('Y-m-d'))
            ->get();

        // Upcoming installments (next 7 days)
        $upcomingInstallments = Installment::with('sale.customer')
            ->where('status', 'Pending')
            ->whereBetween('due_date', [now()->format('Y-m-d'), now()->addDays(7)->format('Y-m-d')])
            ->get();

        return response()->json([
            'total_sales' => $totalSales,
            'total_orders' => $totalOrders,
            'total_customers' => $totalCustomers,
            'total_products' => $totalProducts,
            'low_stock_products' => $lowStockProducts,
            'overdue_installments' => $overdueInstallments,
            'upcoming_installments' => $upcomingInstallments,
        ]);
    }
}
