<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Same validation rules as StoreLessonRequest — all fields required on update too.
 * Kept as a separate class so it can diverge in future (e.g. unique-except-self checks).
 */
class UpdateLessonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        return [
            // ── Lesson meta ────────────────────────────────────────────────────
            'title'        => ['required', 'string', 'max:255'],
            'series'       => ['nullable', 'string', 'max:255'],
            'week_number'  => ['required', 'integer', 'min:1'],
            'age_group'    => ['required', 'in:nursery,kids,youth'],
            'is_published' => ['boolean'],

            // ── Lesson content ─────────────────────────────────────────────────
            'bible_reference' => ['required', 'string', 'max:255'],
            'bible_text'      => ['required', 'string'],
            'explanation'     => ['required', 'string'],

            // Plain string array — matches Create.jsx / Edit.jsx frontend format
            'reflection_questions'   => ['nullable', 'array'],
            'reflection_questions.*' => ['nullable', 'string', 'max:1000'],

            'prayer' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'age_group.in'             => 'Age group must be nursery, kids, or youth.',
            'bible_reference.required' => 'A Bible reference is required (e.g. John 3:16).',
            'bible_text.required'      => 'Please paste or type the scripture passage.',
            'explanation.required'     => 'An explanation is required for families.',
        ];
    }
}