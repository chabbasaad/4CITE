<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'min:3',
                'max:255',
                'regex:/^[a-zA-Z\s]+$/', // Only letters and spaces allowed
            ],
            'email' => [
                'required',
                'string',
                'email:rfc',
                'max:255',
                'unique:users',
            ],
            'password' => [
                'required',
                'string',
                'min:8',
                'max:100',
                'confirmed',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
                'regex:/^\S*$/', // No spaces allowed
                function ($attribute, $value, $fail) {
                    if (strtolower($value) === strtolower($this->input('email')) ||
                        strtolower($value) === strtolower($this->input('name'))) {
                        $fail('The password cannot be the same as your email or name.');
                    }
                },
            ],
            'pseudo' => [
                'required',
                'string',
                'min:3',
                'max:50',
                'unique:users',
                'regex:/^[a-zA-Z0-9]+$/', // Only alphanumeric characters, no spaces
            ],
            'role' => [
                'sometimes',
                'string',
                'in:user,admin,employee',
            ],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        $this->merge([
            'role' => $this->input('role', 'user'),
            'email' => trim($this->input('email')),
        ]);
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.regex' => 'The name may only contain letters and spaces.',
            'pseudo.regex' => 'The pseudo may only contain letters and numbers.',
            'password.regex' => 'The password cannot contain spaces.',
            'email.email' => 'Please enter a valid email address.',
        ];
    }
}
