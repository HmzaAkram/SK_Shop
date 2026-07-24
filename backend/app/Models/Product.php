<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'sku',
        'real_price',
        'selling_price',
        'stock',
        'alert_stock',
        'description',
        'specifications',
        'images',
    ];

    protected $casts = [
        'specifications' => 'array',
        'images' => 'array',
        'real_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
    }

    /**
     * Full public URLs for the stored image paths.
     *
     * @return array<int, string>
     */
    public function getImageUrlsAttribute(): array
    {
        return collect($this->images ?? [])
            ->map(fn (string $path) => Storage::disk('public')->url($path))
            ->values()
            ->all();
    }
}