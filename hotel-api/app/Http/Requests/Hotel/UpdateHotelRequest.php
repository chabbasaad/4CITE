<?php

namespace App\Http\Requests\Hotel;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHotelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only admin can update hotels
        return $this->user() && $this->user()->isAdmin();
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
            'location' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'picture_list' => ['sometimes', 'nullable', 'array'],
            'picture_list.*' => ['string', 'url'],
            'price_per_night' => ['sometimes', 'numeric', 'min:0'],
            'is_available' => ['sometimes', 'boolean']
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.string' => 'The hotel name must be a string',
            'location.string' => 'The hotel location must be a string',
            'description.string' => 'The hotel description must be a string',
            'picture_list.*.url' => 'Each picture must be a valid URL',
            'price_per_night.numeric' => 'The price per night must be a number',
            'price_per_night.min' => 'The price per night must be greater than 0',
        ];
    }
}
