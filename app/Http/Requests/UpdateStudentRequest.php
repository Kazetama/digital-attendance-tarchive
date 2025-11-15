<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // atur sesuai kebutuhan autentikasi admin
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048',
            'email' => 'nullable|email|max:255',
            'class' => 'nullable|string|max:100',
            'major' => 'nullable|string|max:100',
            'parent_phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ];
    }
}
