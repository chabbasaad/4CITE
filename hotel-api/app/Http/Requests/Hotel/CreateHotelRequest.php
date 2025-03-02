<?php

namespace App\Http\Requests\Hotel;

use Illuminate\Foundation\Http\FormRequest;

class CreateHotelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only admin can create hotels
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
            'name' => ['required', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'picture_list' => ['nullable', 'array'],
            'picture_list.*' => ['string', 'url'],
            'price_per_night' => ['required', 'numeric', 'min:0'],
            'is_available' => ['boolean']
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
            'name.required' => 'The hotel name is required',
            'location.required' => 'The hotel location is required',
            'description.required' => 'The hotel description is required',
            'picture_list.*.url' => 'Each picture must be a valid URL',
            'price_per_night.required' => 'The price per night is required',
            'price_per_night.min' => 'The price per night must be greater than 0',
        ];
    }
}
