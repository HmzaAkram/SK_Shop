<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Helper to show 'Not Available' for empty values on frontend if desired
        $na = fn($v) => ($v === null || $v === '' || (is_array($v) && empty($v))) ? null : $v;

        $outstanding = $this->when(isset($this->outstanding_balance), (float) $this->outstanding_balance, 0.0);
        $totalPurchased = $this->when(isset($this->total_purchased), (float) $this->total_purchased, 0.0);
        $totalPaid = $this->when(isset($this->total_paid), (float) $this->total_paid, 0.0);

        $status = 'Not Available';
        if (isset($this->outstanding_balance)) {
            $status = $outstanding > 0 ? 'Overdue' : 'Active';
        }

        return [
            'id' => $this->id,
            'name' => $na($this->name),
            'phone' => $na($this->phone),
            'email' => $na($this->email ?? null),
            'cnic' => $na($this->cnic),
            'address' => $na($this->address),
            'customer_since' => $this->created_at ? $this->created_at->toDateString() : null,
            'status' => $status,

            // Financials
            'outstanding_balance' => $outstanding,
            'total_purchases' => $totalPurchased,
            'total_paid' => $totalPaid,
            'remaining_balance' => max(0.0, $totalPurchased - $totalPaid),

            // Installment stats
            'total_installments' => $this->when(isset($this->total_installments), $this->total_installments),
            'active_installments' => $this->when(isset($this->active_installments), $this->active_installments),
            'completed_installments' => $this->when(isset($this->completed_installments), $this->completed_installments),

            // Collections
            'installments' => InstallmentResource::collection($this->whenLoaded('installments')),
            'purchases' => SaleResource::collection($this->whenLoaded('sales')),
            'payments' => InstallmentResource::collection(collect($this->paid_installments_collection ?? [])),

            // Witness / guarantor info (legacy fields used by sale creation)
            'witness' => [
                'witness_1' => [
                    'full_name' => $na($this->guarantor_name),
                    'phone' => $na($this->guarantor_phone),
                    'cnic' => $na($this->guarantor_cnic),
                    'address' => $na($this->guarantor_address ?? null),
                    'relationship' => $na($this->guarantor_relationship ?? null),
                ],
            ],

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}