<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSaleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer' => ['required', 'array'],
            'customer.name' => ['required', 'string', 'max:255'],
            'customer.phone' => ['required', 'string', 'max:50'],
            'customer.cnic' => ['nullable', 'string', 'max:50'],
            'customer.address' => ['nullable', 'string'],
            'customer.guarantor_name' => ['nullable', 'string', 'max:255'],
            'customer.guarantor_phone' => ['nullable', 'string', 'max:50'],
            'customer.guarantor_cnic' => ['nullable', 'string', 'max:50'],

            'sale_date' => ['required', 'date'],
            'type' => ['required', 'in:Cash,Installment'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'advance_payment' => ['nullable', 'numeric', 'min:0'],
            'total_installments' => ['nullable', 'integer', 'min:1', 'required_if:type,Installment'],
            'monthly_installment' => ['nullable', 'numeric', 'min:0', 'required_if:type,Installment'],

            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'items.*.subtotal' => ['required', 'numeric', 'min:0'],
        ];
    }
}