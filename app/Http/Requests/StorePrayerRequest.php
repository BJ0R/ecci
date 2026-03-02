<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePrayerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'parent' && $this->user()?->is_approved;
    }

    public function rules(): array
    {
        return [
            'body'      => ['required', 'string', 'min:10', 'max:2000'],
            'is_public' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'body.required' => 'Please write your prayer request.',
            'body.min'      => 'Prayer request must be at least 10 characters.',
            'body.max'      => 'Prayer request may not exceed 2,000 characters.',
        ];
    }
}