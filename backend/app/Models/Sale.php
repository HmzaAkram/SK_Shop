<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id', 'invoice_number', 'sale_date', 'type',
        'total_amount', 'advance_payment', 'total_installments', 'monthly_installment',
    ];

    protected $casts = [
        'sale_date'           => 'date',
        'total_amount'        => 'decimal:2',
        'advance_payment'     => 'decimal:2',
        'monthly_installment' => 'decimal:2',
        'total_installments'  => 'integer',
    ];

    public function customer() { return $this->belongsTo(Customer::class); }
    public function items() { return $this->hasMany(SaleItem::class); }
    public function installments() { return $this->hasMany(Installment::class); }
}