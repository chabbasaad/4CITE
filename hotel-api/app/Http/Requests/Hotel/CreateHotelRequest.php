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
            'is_available' => ['boolean'],
            'total_rooms' => ['required', 'integer', 'min:1'],
            'amenities' => ['nullable', 'array'],
            'amenities.*' => ['string'],
            'available_rooms' => ['required', 'integer', 'min:0', 'lte:total_rooms'],
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
            'total_rooms.required' => 'The total number of rooms is required',
            'total_rooms.min' => 'The total number of rooms must be at least 1',
            'available_rooms.required' => 'The number of available rooms is required',
            'available_rooms.lte' => 'The number of available rooms cannot exceed the total number of rooms',
            'amenities.array' => 'Amenities must be a list of strings',
            'amenities.*.string' => 'Each amenity must be a string',
        ];
    }
}
