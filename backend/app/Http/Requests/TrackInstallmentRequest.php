<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TrackInstallmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cnic' => ['required', 'string', 'max:50'],
        ];
    }
}