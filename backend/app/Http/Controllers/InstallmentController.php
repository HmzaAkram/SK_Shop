<?php

namespace App\Http\Controllers;

use App\Models\Installment;
use Illuminate\Http\Request;

class InstallmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Installment::with('sale.customer');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('sale_id')) {
            $query->where('sale_id', $request->sale_id);
        }

        return response()->json($query->orderBy('due_date')->get());
    }

    /**
     * Mark an installment as paid
     */
    public function markPaid(Request $request, Installment $installment)
    {
        $validated = $request->validate([
            'paid_date' => 'required|date',
            'payment_method' => 'required|in:Cash,Bank Transfer,Cheque,JazzCash,EasyPaisa,Other',
            'notes' => 'nullable|string',
        ]);

        $installment->update([
            'status' => 'Paid',
            'paid_date' => $validated['paid_date'],
            'payment_method' => $validated['payment_method'],
            'notes' => $validated['notes'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Installment marked as paid',
            'data' => $installment->load('sale.customer')
        ]);
    }
}
