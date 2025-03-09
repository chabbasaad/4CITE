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
            'is_available' => ['sometimes', 'boolean'],
            'total_rooms' => ['sometimes', 'integer', 'min:1'],
            'amenities' => ['sometimes', 'nullable', 'array'],
            'amenities.*' => ['string'],
            'available_rooms' => ['sometimes', 'integer', 'min:0', 'lte:total_rooms'],
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
            'total_rooms.integer' => 'The total number of rooms must be an integer',
            'total_rooms.min' => 'The total number of rooms must be at least 1',
            'available_rooms.integer' => 'The number of available rooms must be an integer',
            'available_rooms.min' => 'The number of available rooms cannot be negative',
            'available_rooms.lte' => 'The number of available rooms cannot exceed the total number of rooms',
            'amenities.array' => 'Amenities must be a list of strings',
            'amenities.*.string' => 'Each amenity must be a string',
        ];
    }
}
