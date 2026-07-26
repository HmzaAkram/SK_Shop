<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Sale;
use App\Models\Installment;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'cnic',
        'address',
        'guarantor_name',
        'guarantor_phone',
        'guarantor_cnic',
    ];

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    /**
     * All installments related to this customer through sales.
     */
    public function installments()
    {
        return $this->hasManyThrough(Installment::class, Sale::class, 'customer_id', 'sale_id');
    }
}