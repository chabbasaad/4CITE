<?php

namespace App\Http\Requests\Booking;

use Illuminate\Foundation\Http\FormRequest;
use Carbon\Carbon;

class UpdateBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $booking = $this->route('booking');
        $user = $this->user();

        // Allow if user owns the booking or is admin
        return $user && ($booking->user_id === $user->id || $user->isAdmin());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $booking = $this->route('booking');

        return [
            'check_in_date' => [
                'sometimes',
                'date',
                'after_or_equal:today',
                function ($attribute, $value, $fail) use ($booking) {
                    $checkIn = Carbon::parse($value);
                    $checkOut = $this->get('check_out_date')
                        ? Carbon::parse($this->get('check_out_date'))
                        : $booking->check_out_date;

                    // Check if there are any overlapping bookings
                    $overlapping = \App\Models\Booking::where('hotel_id', $booking->hotel_id)
                        ->where('id', '!=', $booking->id)
                        ->where(function ($query) use ($checkIn, $checkOut) {
                            $query->whereBetween('check_in_date', [$checkIn, $checkOut])
                                ->orWhereBetween('check_out_date', [$checkIn, $checkOut])
                                ->orWhere(function ($q) use ($checkIn, $checkOut) {
                                    $q->where('check_in_date', '<=', $checkIn)
                                        ->where('check_out_date', '>=', $checkOut);
                                });
                        })
                        ->exists();

                    if ($overlapping) {
                        $fail('The selected dates are not available for this hotel.');
                    }
                }
            ],
            'check_out_date' => [
                'sometimes',
                'date',
                'after:check_in_date'
            ],
            'guest_names' => ['sometimes', 'array', 'min:1'],
            'guest_names.*' => ['required', 'string', 'max:255'],
            'contact_phone' => ['sometimes', 'string', 'max:20'],
            'special_requests' => ['nullable', 'string', 'max:1000'],
            'status' => ['sometimes', 'string', 'in:pending,confirmed,cancelled']
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
            'guest_names.min' => 'Please provide at least one guest name.',
            'guest_names.*.required' => 'Each guest name is required.',
            'guest_names.*.max' => 'Guest names cannot be longer than 255 characters.'
        ];
    }
}
