<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Expense::latest();
        if ($request->filled('from')) $query->where('expense_date', '>=', $request->string('from'));
        if ($request->filled('to')) $query->where('expense_date', '<=', $request->string('to'));
        if ($request->filled('category')) $query->where('category', $request->string('category'));
        // Plain array — ExpensesTab does Array.isArray(res) on this
        return response()->json($query->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'          => ['required', 'string', 'max:255'],
            'amount'         => ['required', 'numeric', 'min:0'],
            'expense_date'   => ['required', 'date'],
            'payment_method' => ['required', 'in:Cash,Bank Transfer,Cheque,JazzCash,EasyPaisa,Other'],
            'category'       => ['nullable', 'string', 'max:100'],
            'notes'          => ['nullable', 'string'],
        ]);
        return response()->json(['success' => true, 'message' => 'Expense added successfully', 'data' => Expense::create($validated)], 201);
    }

    public function update(Request $request, Expense $expense): JsonResponse
    {
        $validated = $request->validate([
            'title'          => ['sometimes', 'required', 'string', 'max:255'],
            'amount'         => ['sometimes', 'required', 'numeric', 'min:0'],
            'expense_date'   => ['sometimes', 'required', 'date'],
            'payment_method' => ['sometimes', 'required', 'in:Cash,Bank Transfer,Cheque,JazzCash,EasyPaisa,Other'],
            'category'       => ['nullable', 'string', 'max:100'],
            'notes'          => ['nullable', 'string'],
        ]);
        $expense->update($validated);
        return response()->json(['success' => true, 'message' => 'Expense updated', 'data' => $expense]);
    }

    public function destroy(Expense $expense): JsonResponse
    {
        $expense->delete();
        return response()->json(['success' => true, 'message' => 'Expense deleted', 'data' => []]);
    }
}