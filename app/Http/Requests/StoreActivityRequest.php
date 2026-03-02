<?php
// app/Http/Requests/StoreActivityRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreActivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'lesson_id'    => ['nullable', 'exists:lessons,id'],
            'title'        => ['required', 'string', 'max:255'],
            'type'         => ['required', 'in:quiz,fill'],   // drawing removed
            'instructions' => ['required', 'string'],
            'max_score'    => ['nullable', 'integer', 'min:1', 'max:100'],

            // Quiz questions — only validated when type === 'quiz'
            'questions'                           => ['required_if:type,quiz', 'array', 'min:1'],
            'questions.*.question_text'           => ['required_with:questions', 'string', 'max:1000'],
            'questions.*.choices'                 => ['required_with:questions', 'array', 'min:2'],
            'questions.*.choices.*'               => ['required', 'string', 'max:255'],
            'questions.*.correct_answer'          => ['required_with:questions', 'string', 'max:255'],
            'questions.*.points'                  => ['nullable', 'integer', 'min:1', 'max:20'],
        ];
    }

    public function messages(): array
    {
        return [
            'type.in'                                  => 'Activity type must be quiz or fill.',
            'questions.required_if'                    => 'Quiz activities must have at least one question.',
            'questions.min'                            => 'Add at least one question.',
            'questions.*.question_text.required_with'  => 'Each question must have question text.',
            'questions.*.choices.required_with'        => 'Each question must have answer choices.',
            'questions.*.choices.min'                  => 'Each question needs at least 2 choices.',
            'questions.*.correct_answer.required_with' => 'Mark the correct answer for each question.',
        ];
    }
}