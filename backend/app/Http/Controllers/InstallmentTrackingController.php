<?php

namespace App\Http\Controllers;

use App\Http\Requests\TrackInstallmentRequest;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class InstallmentTrackingController extends Controller
{
    /**
     * Public, unauthenticated lookup of a customer's latest installment plan by CNIC.
     * No admin data (guarantor CNIC/phone, other customers, etc.) is exposed here.
     */
    public function track(TrackInstallmentRequest $request): JsonResponse
    {
        $customer = Customer::where('cnic', $request->validated('cnic'))->first();

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'No installment plan found for this CNIC.',
                'data' => null,
            ], 404);
        }

        $sale = $customer->sales()
            ->where('type', 'Installment')
            ->with(['items.product', 'installments'])
            ->latest('sale_date')
            ->first();

        if (!$sale) {
            return response()->json([
                'success' => false,
                'message' => 'No installment plan found for this CNIC.',
                'data' => null,
            ], 404);
        }

        $paidInstallments = $sale->installments->where('status', 'Paid');
        $pendingInstallments = $sale->installments->where('status', '!=', 'Paid');

        $amountPaid = (float) $sale->advance_payment + (float) $paidInstallments->sum('amount');
        $totalBill = (float) $sale->total_amount;

        return response()->json([
            'success' => true,
            'message' => 'Installment plan found',
            'data' => [
                'customerName' => $customer->name,
                'purchaseDate' => Carbon::parse($sale->sale_date)->format('d M, Y'),
                'products' => $sale->items->map(fn ($item) => $item->product?->name ?? 'Unknown product')->values()->all(),
                'totalBill' => $totalBill,
                'amountPaid' => $amountPaid,
                'amountRemaining' => max($totalBill - $amountPaid, 0),
                'paidMonths' => $paidInstallments->sortBy('paid_date')
                    ->map(fn ($installment) => $installment->paid_date ? Carbon::parse($installment->paid_date)->format('F') : null)
                    ->filter()
                    ->values()
                    ->all(),
                'remainingInstallments' => $pendingInstallments->count(),
                'installmentPerMonth' => (float) $sale->monthly_installment,
            ],
        ]);
    }
}