<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmitActivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Parent must be approved; child ownership verified in controller
        return $this->user()?->role === 'parent' && $this->user()?->is_approved;
    }

    public function rules(): array
    {
        return [
            // child_profile_id must exist AND belong to this parent (verified in controller)
            'child_profile_id' => [
                'required',
                'integer',
                'exists:child_profiles,id',
            ],

            // answers is a JSON object keyed by question_id → answer string
            // Nullable to allow drawing/fill submissions with no typed answers
            'answers'          => ['nullable', 'array'],
            'answers.*'        => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'child_profile_id.required' => 'Please select which child is taking this activity.',
            'child_profile_id.exists'   => 'The selected child profile could not be found.',
        ];
    }
}