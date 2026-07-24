<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'phone' => $this->phone,
            'cnic' => $this->cnic,
            'address' => $this->address,
            'guarantor_name' => $this->guarantor_name,
            'guarantor_phone' => $this->guarantor_phone,
            'guarantor_cnic' => $this->guarantor_cnic,
            'sales_count' => $this->when(isset($this->sales_count), $this->sales_count),
            'total_purchased' => $this->when(isset($this->sales_sum_total_amount), (float) $this->sales_sum_total_amount),
            'sales' => SaleResource::collection($this->whenLoaded('sales')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}