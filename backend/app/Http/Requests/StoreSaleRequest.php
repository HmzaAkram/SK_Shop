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
            'customer.witnesses' => ['nullable', 'array'],
            'customer.witnesses.*.full_name' => ['nullable', 'string', 'max:255'],
            'customer.witnesses.*.phone' => ['nullable', 'string', 'max:50'],
            'customer.witnesses.*.cnic' => ['nullable', 'string', 'max:50'],
            'customer.witnesses.*.address' => ['nullable', 'string'],

            'sale_date' => ['required', 'date'],
            'type' => ['required', 'in:Cash,Installment'],
            // total_amount is computed server-side; accept but not required from client
            'total_amount' => ['nullable', 'numeric', 'min:0'],
            'advance_payment' => ['nullable', 'numeric', 'min:0'],
            'payment_method' => ['nullable', 'string'],
            'payment_account_id' => ['nullable', 'integer', 'exists:payment_accounts,id'],
            'total_installments' => ['nullable', 'integer', 'min:1', 'required_if:type,Installment'],
            'monthly_installment' => ['nullable', 'numeric', 'min:0', 'required_if:type,Installment'],

            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            // unit_price/subtotal in payload are ignored by backend and recomputed; discount is optional
            'items.*.unit_price' => ['nullable', 'numeric', 'min:0'],
            'items.*.subtotal' => ['nullable', 'numeric', 'min:0'],
            'items.*.discount' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}