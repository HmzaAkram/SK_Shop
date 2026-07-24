<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $customer = $this->route('customer');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'phone' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                Rule::unique('customers', 'phone')->ignore($customer?->id),
            ],
            'cnic' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string'],
            'guarantor_name' => ['nullable', 'string', 'max:255'],
            'guarantor_phone' => ['nullable', 'string', 'max:50'],
            'guarantor_cnic' => ['nullable', 'string', 'max:50'],
        ];
    }
}