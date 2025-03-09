<?php

namespace App\Http\Requests\Booking;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class CreateBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Any authenticated user can create a booking
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'hotel_id' => ['required', 'exists:hotels,id', function ($attribute, $value, $fail) {
                $hotel = \App\Models\Hotel::find($value);
                if (! $hotel->is_available) {
                    $fail('This hotel is not available for booking.');
                }
            }],
            'check_in_date' => [
                'required',
                'date',
                'after_or_equal:today',
                function ($attribute, $value, $fail) {
                    $checkIn = Carbon::parse($value);
                    $checkOut = $this->get('check_out_date') ? Carbon::parse($this->get('check_out_date')) : null;

                    // Check if there are any overlapping bookings
                    $overlapping = \App\Models\Booking::where('hotel_id', $this->get('hotel_id'))
                        ->where(function ($query) use ($checkIn, $checkOut) {
                            $query->whereBetween('check_in_date', [$checkIn, $checkOut])
                                ->orWhereBetween('check_out_date', [$checkIn, $checkOut])
                                ->orWhere(function ($q) use ($checkIn, $checkOut) {
                                    $q->where('check_in_date', '<=', $checkIn)
                                        ->where('check_out_date', '>=', $checkOut);
                                });
                        })->exists();

                    if ($overlapping) {
                        $fail('The selected dates are not available for this hotel.');
                    }
                },
            ],
            'check_out_date' => [
                'required',
                'date',
                'after:check_in_date',
            ],
            'guest_names' => ['required', 'array', 'min:1'],
            'guest_names.*' => ['required', 'string', 'max:255'],
            'contact_phone' => ['required', 'string', 'max:20'],
            'special_requests' => ['nullable', 'string', 'max:1000'],
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
            'guest_names.required' => 'Please provide at least one guest name.',
            'guest_names.min' => 'Please provide at least one guest name.',
            'guest_names.*.required' => 'Each guest name is required.',
            'guest_names.*.max' => 'Guest names cannot be longer than 255 characters.',
        ];
    }
}
