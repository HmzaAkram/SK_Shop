<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Installment extends Model
{
    use HasFactory;

    protected $fillable = [
        'sale_id', 'installment_number', 'amount', 'due_date',
        'paid_date', 'status', 'payment_method', 'notes',
    ];

    protected $casts = [
        'amount'             => 'decimal:2',
        'due_date'           => 'date:Y-m-d',
        'paid_date'          => 'date:Y-m-d',
        'installment_number' => 'integer',
    ];

    public function sale() { return $this->belongsTo(Sale::class); }
}