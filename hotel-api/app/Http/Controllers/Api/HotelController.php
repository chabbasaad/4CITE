<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Hotel\CreateHotelRequest;
use App\Http\Requests\Hotel\UpdateHotelRequest;
use App\Models\Hotel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HotelController extends Controller
{
    /**
     * List all hotels with pagination and sorting.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = Hotel::query();

        // Apply search filters if provided
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('location', 'like', "%{$request->search}%")
                    ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        // Apply availability filter
        if ($request->boolean('available')) {
            $query->available();
        }

        // Apply sorting with validation
        $allowedSortFields = ['name', 'location', 'created_at', 'price_per_night'];
        $sortBy = in_array($request->sort_by, $allowedSortFields) ? $request->sort_by : 'created_at';
        $direction = in_array(strtolower($request->direction), ['asc', 'desc']) ? strtolower($request->direction) : 'desc';

        $query->orderBy($sortBy, $direction);

        // Get paginated results
        $perPage = min(max((int)$request->get('per_page', 10), 1), 100); // Limit between 1 and 100
        $hotels = $query->paginate($perPage);

        // If user is logged in and is staff, include additional information
        if ($request->user() && $request->user()->isStaff()) {
            $hotels->load('bookings.user');
        }

        return response()->json(['data' => $hotels->items()]);
    }

    /**
     * Store a newly created hotel.
     *
     * @param CreateHotelRequest $request
     * @return JsonResponse
     */
    public function store(CreateHotelRequest $request): JsonResponse
    {
        // Only admin can create hotels (handled in CreateHotelRequest)
        $validated = $request->validated();
        $hotel = Hotel::create($validated);

        return response()->json([
            'message' => 'Hotel created successfully',
            'data' => $hotel
        ], 201);
    }

    /**
     * Display the specified hotel.
     *
     * @param Request $request
     * @param Hotel $hotel
     * @return JsonResponse
     */
    public function show(Request $request, Hotel $hotel): JsonResponse
    {
        // If user is logged in and is staff, include additional information
        if ($request->user() && $request->user()->isStaff()) {
            $hotel->load('bookings.user');
        }

        return response()->json(['data' => $hotel]);
    }

    /**
     * Update the specified hotel.
     *
     * @param UpdateHotelRequest $request
     * @param Hotel $hotel
     * @return JsonResponse
     */
    public function update(UpdateHotelRequest $request, Hotel $hotel): JsonResponse
    {
        // Only admin can update hotels (handled in UpdateHotelRequest)
        $validated = $request->validated();
        $hotel->update($validated);

        return response()->json([
            'message' => 'Hotel updated successfully',
            'data' => $hotel
        ]);
    }

    /**
     * Remove the specified hotel.
     *
     * @param Request $request
     * @param Hotel $hotel
     * @return JsonResponse
     */
    public function destroy(Request $request, Hotel $hotel): JsonResponse
    {
        // Only admin can delete hotels
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Only administrators can delete hotels'
            ], 403);
        }

        // Check if hotel has any bookings before deletion
        if ($hotel->bookings()->exists()) {
            return response()->json([
                'message' => 'Cannot delete hotel with existing bookings'
            ], 409);
        }

        $hotel->delete();

        return response()->json([
            'message' => 'Hotel deleted successfully'
        ]);
    }
}
