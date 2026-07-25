<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Sale;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function summary(Request $request): JsonResponse
    {
        $from = $request->get('from', now()->startOfMonth()->format('Y-m-d'));
        $to   = $request->get('to', now()->format('Y-m-d'));

        $salesAggregates = Sale::whereBetween('sale_date', [$from, $to])
            ->selectRaw('
                SUM(total_amount) as total_sales,
                COUNT(*) as sales_count,
                SUM(CASE WHEN type = ? THEN total_amount ELSE 0 END) as cash_sales,
                SUM(CASE WHEN type = ? THEN total_amount ELSE 0 END) as installment_sales
            ', ['Cash', 'Installment'])
            ->first();

        $totalExpenses      = (float) Expense::whereBetween('expense_date', [$from, $to])->sum('amount');
        $totalSales         = (float) ($salesAggregates->total_sales ?? 0);
        $profit             = $totalSales - $totalExpenses;
        $sixMonthsAgo       = now()->subMonths(6)->startOfMonth();

        $monthlySales = Sale::select(
                DB::raw("DATE_FORMAT(sale_date, '%Y-%m') as month"),
                DB::raw('SUM(total_amount) as total')
            )
            ->where('sale_date', '>=', $sixMonthsAgo)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $monthlyExpenses = Expense::select(
                DB::raw("DATE_FORMAT(expense_date, '%Y-%m') as month"),
                DB::raw('SUM(amount) as total')
            )
            ->where('expense_date', '>=', $sixMonthsAgo)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $topProducts = DB::table('sale_items')
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->whereBetween('sales.sale_date', [$from, $to])
            ->selectRaw('
                products.id,
                products.name,
                SUM(sale_items.quantity) as total_quantity,
                SUM(sale_items.subtotal) as total_revenue
            ')
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_revenue')
            ->limit(10)
            ->get();

        return response()->json([
            'from'              => $from,
            'to'                => $to,
            'total_sales'       => $totalSales,
            'total_expenses'    => $totalExpenses,
            'profit'            => $profit,
            'sales_count'       => (int) ($salesAggregates->sales_count ?? 0),
            'cash_sales'        => (float) ($salesAggregates->cash_sales ?? 0),
            'installment_sales' => (float) ($salesAggregates->installment_sales ?? 0),
            'monthly_sales'     => $monthlySales,
            'monthly_expenses'  => $monthlyExpenses,
            'top_products'      => $topProducts,
        ]);
    }
}