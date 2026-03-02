<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreChildProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Parent must be approved to add/edit child profiles
        return $this->user()?->role === 'parent' && $this->user()?->is_approved;
    }

    public function rules(): array
    {
        return [
            'name'         => ['required', 'string', 'max:255'],
            'age'          => ['required', 'integer', 'min:1', 'max:18'],
            'grade'        => ['nullable', 'string', 'max:100'],
            'avatar_color' => ['nullable', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ];
    }

    public function messages(): array
    {
        return [
            'age.min'              => "Child's age must be at least 1.",
            'age.max'              => "Child's age must be 18 or under.",
            'avatar_color.regex'   => 'Avatar color must be a valid hex color (e.g. #B8923A).',
        ];
    }
}