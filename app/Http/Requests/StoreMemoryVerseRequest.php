<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMemoryVerseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'verse_text'   => ['required', 'string'],
            'reference'    => ['required', 'string', 'max:255'],
            'week_number'  => ['required', 'integer', 'min:1', 'max:52'],
            'context_note' => ['nullable', 'string'],
        ];
    }
}