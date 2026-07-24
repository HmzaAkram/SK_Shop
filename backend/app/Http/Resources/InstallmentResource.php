<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InstallmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sale_id' => $this->sale_id,
            'installment_number' => $this->installment_number,
            'amount' => $this->amount,
            'due_date' => $this->due_date,
            'paid_date' => $this->paid_date,
            'status' => $this->status,
            'payment_method' => $this->payment_method,
            'notes' => $this->notes,
            'sale' => new SaleResource($this->whenLoaded('sale')),
        ];
    }
}