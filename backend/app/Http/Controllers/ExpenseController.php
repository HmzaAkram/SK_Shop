<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $query = Expense::latest();

        // Filter by date range
        if ($request->has('from')) {
            $query->where('expense_date', '>=', $request->from);
        }
        if ($request->has('to')) {
            $query->where('expense_date', '<=', $request->to);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'expense_date' => 'required|date',
            'payment_method' => 'required|in:Cash,Bank Transfer,Cheque,JazzCash,EasyPaisa,Other',
            'category' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]);

        $expense = Expense::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Expense added successfully',
            'data' => $expense
        ], 201);
    }

    public function update(Request $request, Expense $expense)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'amount' => 'sometimes|required|numeric|min:0',
            'expense_date' => 'sometimes|required|date',
            'payment_method' => 'sometimes|required|in:Cash,Bank Transfer,Cheque,JazzCash,EasyPaisa,Other',
            'category' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]);

        $expense->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Expense updated',
            'data' => $expense
        ]);
    }

    public function destroy(Expense $expense)
    {
        $expense->delete();

        return response()->json([
            'success' => true,
            'message' => 'Expense deleted'
        ]);
    }
}
