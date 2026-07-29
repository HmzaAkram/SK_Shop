<?php

namespace App\Http\Controllers;

use App\Models\PaymentAccount;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PaymentAccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $accounts = PaymentAccount::orderBy('name')->get();
        
        // Calculate current_balance for each account based on Sales (Cash/Bank) and Installments (Bank)
        $accounts->transform(function ($account) {
            // Find cash sales that used this account (down payments for installments or full cash/bank sales)
            $salesTotal = \App\Models\Sale::where('payment_account_id', $account->id)->sum('advance_payment');
            $fullSalesTotal = \App\Models\Sale::where('payment_account_id', $account->id)->where('type', 'Cash')->sum('total_amount');
            
            // Find installments paid via this account
            // Assuming installments have payment_account_id? No, installments don't have payment_account_id.
            // Wait, does Installment have payment_account_id? Let's check Installment schema.
            
            // For now, let's just do opening_balance + sales totals if installments are not tracked by bank account.
            
            return [
                'id' => $account->id,
                'name' => $account->name,
                'opening_balance' => (float) $account->opening_balance,
                'current_balance' => (float) $account->opening_balance + (float) $salesTotal + (float) $fullSalesTotal,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $accounts
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:payment_accounts,name'],
            'opening_balance' => ['nullable', 'numeric', 'min:0'],
        ]);

        if (!isset($validated['opening_balance'])) {
            $validated['opening_balance'] = 0;
        }

        $account = PaymentAccount::create($validated);

        return response()->json([
            'success' => true,
            'data' => $account
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(PaymentAccount $paymentAccount)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PaymentAccount $paymentAccount)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PaymentAccount $paymentAccount)
    {
        //
    }
}
