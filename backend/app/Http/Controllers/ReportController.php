<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function summary(Request $request): JsonResponse
    {
        // Determine date range based on request parameters
        $fromDate = $request->query('from_date');
        $toDate   = $request->query('to_date');
        $month    = $request->query('month');
        $year     = $request->query('year');

        if ($fromDate && $toDate) {
            $from = Carbon::createFromFormat('Y-m-d', $fromDate)->startOfDay()->format('Y-m-d');
            $to   = Carbon::createFromFormat('Y-m-d', $toDate)->endOfDay()->format('Y-m-d');
        } elseif ($month && $year) {
            $from = Carbon::create($year, $month, 1)->startOfMonth()->format('Y-m-d');
            $to   = Carbon::create($year, $month, 1)->endOfMonth()->format('Y-m-d');
        } else {
            $from = Carbon::now()->startOfMonth()->format('Y-m-d');
            $to   = Carbon::now()->endOfDay()->format('Y-m-d');
        }

        // Revenue: canonical source -> sum of sale_items.subtotal for date range
        $totalRevenue = SaleItem::whereHas('sale', function ($q) use ($from, $to) {
            $q->whereBetween('sale_date', [$from, $to]);
        })->selectRaw('COALESCE(SUM(subtotal),0) as total')->value('total');

        // COGS: sum of cost_price * quantity for sale items in range
        $totalCogs = SaleItem::whereHas('sale', function ($q) use ($from, $to) {
            $q->whereBetween('sale_date', [$from, $to]);
        })->selectRaw('COALESCE(SUM(cost_price * quantity),0) as total')->value('total');

        $totalExpenses      = (float) Expense::whereBetween('expense_date', [$from, $to])->sum('amount');

        $grossProfit = (float) $totalRevenue - (float) $totalCogs;
        $netProfit = $grossProfit - $totalExpenses;

        $sixMonthsAgo       = now()->subMonths(6)->startOfMonth();

        // Monthly revenue (from sale_items.subtotal)
        $monthlySales = SaleItem::selectRaw("DATE_FORMAT(sales.sale_date, '%Y-%m') as month, SUM(sale_items.subtotal) as total")
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->where('sales.sale_date', '>=', $sixMonthsAgo)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Monthly COGS
        $monthlyCogs = SaleItem::selectRaw("DATE_FORMAT(sales.sale_date, '%Y-%m') as month, SUM(sale_items.cost_price * sale_items.quantity) as total")
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->where('sales.sale_date', '>=', $sixMonthsAgo)
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
                SUM(sale_items.subtotal) as total_revenue,
                SUM(sale_items.cost_price * sale_items.quantity) as total_cogs
            ')
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_revenue')
            ->limit(10)
            ->get();

        return response()->json([
            'from'              => $from,
            'to'                => $to,
            'total_sales'       => (float) $totalRevenue,
            'total_cogs'        => (float) $totalCogs,
            'total_expenses'    => (float) $totalExpenses,
            'gross_profit'      => (float) $grossProfit,
            'profit'            => (float) $netProfit, // keep 'profit' key but this is now net profit
            'sales_count'       => (int) (Sale::whereBetween('sale_date', [$from, $to])->count()),
            'cash_sales'        => (float) Sale::whereBetween('sale_date', [$from, $to])->where('type','Cash')->sum('total_amount'),
            'installment_sales' => (float) Sale::whereBetween('sale_date', [$from, $to])->where('type','Installment')->sum('total_amount'),
            'monthly_sales'     => $monthlySales,
            'monthly_cogs'      => $monthlyCogs,
            'monthly_expenses'  => $monthlyExpenses,
            'top_products'      => $topProducts,
        ]);
    }
}