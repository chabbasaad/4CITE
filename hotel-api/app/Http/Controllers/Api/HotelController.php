<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Hotel\CreateHotelRequest;
use App\Http\Requests\Hotel\UpdateHotelRequest;
use App\Models\Hotel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HotelController extends Controller
{
    /**
     * List all hotels with pagination, sorting, and filtering.
     */
    public function index(Request $request): JsonResponse
    {
        // Validate request parameters
        $validator = Validator::make($request->all(), [
            'min_price' => 'nullable|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0|gte:min_price',
            'available' => 'nullable|boolean',
            'search' => 'nullable|string|max:255',
            'sort_by' => 'nullable|string|in:name,location,price_per_night,created_at',
            'direction' => 'nullable|string|in:asc,desc',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid parameters',
                'errors' => $validator->errors(),
            ], 422);
        }

        $query = Hotel::query();

        // Apply search filter
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                    ->orWhere('location', 'like', "%{$searchTerm}%")
                    ->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }

        // Apply price range filter
        if ($request->filled('min_price')) {
            $query->where('price_per_night', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price_per_night', '<=', $request->max_price);
        }

        // Apply availability filter
        if ($request->has('available')) {
            $query->where('is_available', filter_var($request->available, FILTER_VALIDATE_BOOLEAN));
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $direction = strtolower($request->get('direction', 'desc'));
        $query->orderBy($sortBy, $direction);

        // Get paginated results with relationships if user is staff
        $perPage = $request->get('per_page', 10);

        if ($request->user() && $request->user()->isStaff()) {
            $query->with('bookings.user');
        }

        $hotels = $query->paginate($perPage);

        return response()->json([
            'data' => $hotels->items(),
            'meta' => [
                'current_page' => $hotels->currentPage(),
                'per_page' => $hotels->perPage(),
                'total' => $hotels->total(),
                'last_page' => $hotels->lastPage(),
            ],
        ]);
    }

    /**
     * Store a newly created hotel.
     */
    public function store(CreateHotelRequest $request): JsonResponse
    {
        // Only admin can create hotels (handled in CreateHotelRequest)
        $validated = $request->validated();
        $hotel = Hotel::create($validated);

        return response()->json([
            'message' => 'Hotel created successfully',
            'data' => $hotel,
        ], 201);
    }

    /**
     * Display the specified hotel.
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
     */
    public function update(UpdateHotelRequest $request, Hotel $hotel): JsonResponse
    {
        // Only admin can update hotels (handled in UpdateHotelRequest)
        $validated = $request->validated();
        $hotel->update($validated);

        return response()->json([
            'message' => 'Hotel updated successfully',
            'data' => $hotel,
        ]);
    }

    /**
     * Remove the specified hotel.
     */
    public function destroy(Request $request, Hotel $hotel): JsonResponse
    {
        // Only admin can delete hotels
        if (! $request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Only administrators can delete hotels',
            ], 403);
        }

        // Check if hotel has any bookings before deletion
        if ($hotel->bookings()->exists()) {
            return response()->json([
                'message' => 'Cannot delete hotel with existing bookings',
            ], 409);
        }

        $hotel->delete();

        return response()->json([
            'message' => 'Hotel deleted successfully',
        ]);
    }
}
