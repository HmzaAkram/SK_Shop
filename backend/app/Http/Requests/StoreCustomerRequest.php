<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:50', 'unique:customers,phone'],
            'cnic' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string'],
            'guarantor_name' => ['nullable', 'string', 'max:255'],
            'guarantor_phone' => ['nullable', 'string', 'max:50'],
            'guarantor_cnic' => ['nullable', 'string', 'max:50'],
        ];
    }
}