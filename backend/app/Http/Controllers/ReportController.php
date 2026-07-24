<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function summary(Request $request)
    {
        $from = $request->get('from', now()->startOfMonth()->format('Y-m-d'));
        $to = $request->get('to', now()->format('Y-m-d'));

        $totalSales = Sale::whereBetween('sale_date', [$from, $to])->sum('total_amount');
        $totalExpenses = Expense::whereBetween('expense_date', [$from, $to])->sum('amount');
        $profit = $totalSales - $totalExpenses;

        $salesCount = Sale::whereBetween('sale_date', [$from, $to])->count();
        $cashSales = Sale::whereBetween('sale_date', [$from, $to])->where('type', 'Cash')->sum('total_amount');
        $installmentSales = Sale::whereBetween('sale_date', [$from, $to])->where('type', 'Installment')->sum('total_amount');

        // Monthly breakdown (last 6 months)
        $monthlySales = Sale::select(
            DB::raw("DATE_FORMAT(sale_date, '%Y-%m') as month"),
            DB::raw('SUM(total_amount) as total')
        )
            ->where('sale_date', '>=', now()->subMonths(6)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $monthlyExpenses = Expense::select(
            DB::raw("DATE_FORMAT(expense_date, '%Y-%m') as month"),
            DB::raw('SUM(amount) as total')
        )
            ->where('expense_date', '>=', now()->subMonths(6)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json([
            'from' => $from,
            'to' => $to,
            'total_sales' => $totalSales,
            'total_expenses' => $totalExpenses,
            'profit' => $profit,
            'sales_count' => $salesCount,
            'cash_sales' => $cashSales,
            'installment_sales' => $installmentSales,
            'monthly_sales' => $monthlySales,
            'monthly_expenses' => $monthlyExpenses,
        ]);
    }
}
