<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\HotelController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
|
| These routes are accessible without authentication
|
*/

// Authentication routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Protected auth routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
    });
});

/*
|--------------------------------------------------------------------------
| Hotel Routes (Public)
|--------------------------------------------------------------------------
|
| GET /api/hotels
|   - List and search hotels
|   - Query Parameters:
|     * search: Search in name, location, description
|     * min_price: Minimum price per night
|     * max_price: Maximum price per night
|     * available: Filter by availability (true/false)
|     * sort_by: Sort field (name, location, price_per_night, created_at)
|     * direction: Sort direction (asc, desc)
|     * per_page: Results per page (1-100)
|
| GET /api/hotels/{id}
|   - View hotel details
|   - Staff users see additional booking information
|
*/
Route::get('hotels', [HotelController::class, 'index']);
Route::get('hotels/{hotel}', [HotelController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
|
| These routes require authentication (Bearer token)
|
*/
Route::middleware('auth:sanctum')->group(function () {
    /*
    |--------------------------------------------------------------------------
    | User Management Routes
    |--------------------------------------------------------------------------
    |
    | POST   /api/users          - Create user (admin: any role, employee: user role only)
    | GET    /api/users          - List users (admin/employee only)
    | GET    /api/users/{id}     - Show user (own profile or admin/employee)
    | PUT    /api/users/{id}     - Update user (own profile or admin)
    | DELETE /api/users/{id}     - Delete user (own profile or admin)
    |
    */
    Route::apiResource('users', UserController::class);

    /*
    |--------------------------------------------------------------------------
    | Hotel Management Routes (Protected)
    |--------------------------------------------------------------------------
    |
    | POST   /api/hotels          - Create hotel (admin only)
    | PUT    /api/hotels/{id}     - Update hotel (admin only)
    | DELETE /api/hotels/{id}     - Delete hotel (admin only)
    |
    */
    Route::apiResource('hotels', HotelController::class)->except(['index', 'show']);

    /*
    |--------------------------------------------------------------------------
    | Booking Management Routes
    |--------------------------------------------------------------------------
    |
    | GET    /api/bookings
    |   - List and search bookings
    |   - Query Parameters:
    |     * search: Search by user email/name or hotel name
    |     * status: Filter by status (pending, confirmed, cancelled)
    |     * from_date: Filter by check-in date range start
    |     * to_date: Filter by check-in date range end
    |     * sort_by: Sort field (check_in_date, created_at, status)
    |     * direction: Sort direction (asc, desc)
    |     * per_page: Results per page (1-100)
    |   - Regular users see only their bookings
    |   - Staff users can see and search all bookings
    |
    | POST   /api/bookings          - Create booking (any authenticated user)
    | GET    /api/bookings/{id}     - Show booking details (own booking or admin)
    | PUT    /api/bookings/{id}     - Update booking (own booking or admin)
    | DELETE /api/bookings/{id}     - Cancel booking (own booking or admin)
    |
    */
    Route::apiResource('bookings', BookingController::class);
});
