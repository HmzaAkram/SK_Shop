<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}