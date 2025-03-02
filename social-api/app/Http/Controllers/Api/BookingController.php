<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Booking\CreateBookingRequest;
use App\Http\Requests\Booking\UpdateBookingRequest;
use App\Models\Booking;
use App\Models\Hotel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;

class BookingController extends Controller
{
    /**
     * List bookings with filters.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Booking::query();

        // If regular user, only show own bookings
        // If employee/admin, show all bookings
        if (!$user->isStaff()) {
            $query->where('user_id', $user->id);
        } else {
            // Staff can search by:
            // - Booking ID
            // - User email/name/pseudo
            // - Hotel name/location
            if ($request->search) {
                $query->where(function($q) use ($request) {
                    // Search by booking ID
                    if (is_numeric($request->search)) {
                        $q->orWhere('id', $request->search);
                    }

                    // Search by user details
                    $q->orWhereHas('user', function ($userQuery) use ($request) {
                        $userQuery->where('email', 'like', "%{$request->search}%")
                            ->orWhere('name', 'like', "%{$request->search}%")
                            ->orWhere('pseudo', 'like', "%{$request->search}%");
                    });

                    // Search by hotel details
                    $q->orWhereHas('hotel', function ($hotelQuery) use ($request) {
                        $hotelQuery->where('name', 'like', "%{$request->search}%")
                            ->orWhere('location', 'like', "%{$request->search}%");
                    });
                });
            }
        }

        // Filter by hotel if provided
        if ($request->hotel_id) {
            $query->where('hotel_id', $request->hotel_id);
        }

        // Filter by date range if provided
        if ($request->from_date) {
            $query->where('check_in_date', '>=', $request->from_date);
        }
        if ($request->to_date) {
            $query->where('check_out_date', '<=', $request->to_date);
        }

        // Sort by check-in date by default
        $query->orderBy($request->get('sort_by', 'check_in_date'), $request->get('direction', 'asc'));

        // Get paginated results with relationships
        $bookings = $query->with(['hotel', 'user'])
            ->paginate($request->get('per_page', 10));

        return response()->json(['data' => $bookings->items()]);
    }

    /**
     * Store a newly created booking.
     *
     * @param CreateBookingRequest $request
     * @return JsonResponse
     */
    public function store(CreateBookingRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $hotel = Hotel::findOrFail($validated['hotel_id']);

        // Ensure guest_names is an array and set guests_count
        $validated['guest_names'] = is_array($validated['guest_names']) ? $validated['guest_names'] : [$validated['guest_names']];
        $validated['guests_count'] = count($validated['guest_names']);

        // Calculate total price
        $checkIn = Carbon::parse($validated['check_in_date']);
        $checkOut = Carbon::parse($validated['check_out_date']);
        $nights = $checkIn->diffInDays($checkOut);
        $validated['total_price'] = $hotel->price_per_night * $nights;

        // Set initial status and user
        $validated['status'] = 'pending';
        $validated['user_id'] = $request->user()->id;

        $booking = Booking::create($validated);

        return response()->json([
            'message' => 'Booking created successfully',
            'data' => $booking
        ], 201);
    }

    /**
     * Display the specified booking.
     *
     * @param Request $request
     * @param Booking $booking
     * @return JsonResponse
     */
    public function show(Request $request, Booking $booking): JsonResponse
    {
        $user = $request->user();

        // Check if user can view this booking
        if (!$user->isStaff() && $booking->user_id !== $user->id) {
            return response()->json([
                'message' => 'You are not authorized to view this booking'
            ], 403);
        }

        $booking->load(['hotel', 'user']);
        return response()->json($booking);
    }

    /**
     * Update the specified booking.
     *
     * @param UpdateBookingRequest $request
     * @param Booking $booking
     * @return JsonResponse
     */
    public function update(UpdateBookingRequest $request, Booking $booking): JsonResponse
    {
        $validated = $request->validated();

        // Ensure guest_names is an array if provided
        if (isset($validated['guest_names'])) {
            $validated['guest_names'] = is_array($validated['guest_names']) ? $validated['guest_names'] : [$validated['guest_names']];
            $validated['guests_count'] = count($validated['guest_names']);
        }

        // Recalculate total price if dates changed
        if (isset($validated['check_in_date']) || isset($validated['check_out_date'])) {
            $checkIn = Carbon::parse($validated['check_in_date'] ?? $booking->check_in_date);
            $checkOut = Carbon::parse($validated['check_out_date'] ?? $booking->check_out_date);
            $nights = $checkIn->diffInDays($checkOut);
            $validated['total_price'] = $booking->hotel->price_per_night * $nights;
        }

        $booking->update($validated);

        return response()->json([
            'message' => 'Booking updated successfully',
            'data' => $booking->fresh()
        ]);
    }

    /**
     * Remove the specified booking.
     *
     * @param Request $request
     * @param Booking $booking
     * @return JsonResponse
     */
    public function destroy(Request $request, Booking $booking): JsonResponse
    {
        $user = $request->user();

        // Check if user can delete this booking
        if (!$user->isAdmin() && $booking->user_id !== $user->id) {
            return response()->json([
                'message' => 'You are not authorized to delete this booking'
            ], 403);
        }

        // Check if booking can be cancelled (e.g., not too close to check-in date)
        // Only apply this restriction to non-staff users
        if (!$user->isStaff()) {
            $checkIn = new \DateTime($booking->check_in_date);
            $now = new \DateTime();
            $daysUntilCheckIn = $now->diff($checkIn)->days;

            if ($daysUntilCheckIn < 2) {
                return response()->json([
                    'message' => 'Bookings can only be cancelled at least 2 days before check-in'
                ], 400);
            }
        }

        $booking->delete();

        return response()->json([
            'message' => 'Booking cancelled successfully'
        ]);
    }
}
