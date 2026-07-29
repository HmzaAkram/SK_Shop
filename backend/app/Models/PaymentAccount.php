<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentAccount extends Model
{
    protected $fillable = ['name', 'opening_balance'];
}
