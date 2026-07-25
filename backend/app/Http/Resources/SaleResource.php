<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SaleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'invoice_number' => $this->invoice_number,
            'customer_id' => $this->customer_id,
            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'sale_date' => $this->sale_date,
            'type' => $this->type,
            'total_amount' => $this->total_amount,
            'advance_payment' => $this->advance_payment,
            'total_installments' => $this->total_installments,
            'monthly_installment' => $this->monthly_installment,
                        'total_cogs' => $this->total_cogs,
                        'items' => SaleItemResource::collection($this->whenLoaded('items')),
                        'installments' => InstallmentResource::collection($this->whenLoaded('installments')),
                        'created_at' => $this->created_at,
                        'updated_at' => $this->updated_at,
        ];
    }
}