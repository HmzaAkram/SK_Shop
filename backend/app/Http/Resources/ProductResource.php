<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'name' => $this->name,
            'sku' => $this->sku,
            'real_price' => $this->real_price,
            'selling_price' => $this->selling_price,
            'stock' => $this->stock,
            'alert_stock' => $this->alert_stock,
            'is_low_stock' => $this->stock <= $this->alert_stock,
            'description' => $this->description,
            'specifications' => $this->specifications,
            'images' => $this->image_urls,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}