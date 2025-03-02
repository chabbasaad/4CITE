<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        $targetUserId = $this->route('user')->id;

        return $user->isAdmin() || $user->id === $targetUserId;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => [
                'sometimes',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($this->route('user')),
            ],
            'pseudo' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('users')->ignore($this->route('user')),
            ],
            'password' => ['sometimes', 'string', 'min:8', 'confirmed'],
            'role' => [
                'sometimes',
                'string',
                Rule::in(['user', 'employee', 'admin']),
                // Only admins can change roles
                function ($attribute, $value, $fail) {
                    if ($value !== $this->user()->role && !$this->user()->isAdmin()) {
                        $fail('You are not authorized to change roles.');
                    }
                },
            ],
        ];
    }
}
