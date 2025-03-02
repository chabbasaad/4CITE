<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\HotelController;
use App\Http\Controllers\Api\BookingController;
use Illuminate\Http\Request;
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
});

// Public hotel routes
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
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

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
    | GET    /api/bookings          - List bookings (user: own bookings, admin: all bookings with search)
    | POST   /api/bookings          - Create booking (any authenticated user)
    | GET    /api/bookings/{id}     - Show booking details (own booking or admin)
    | PUT    /api/bookings/{id}     - Update booking (own booking or admin)
    | DELETE /api/bookings/{id}     - Cancel booking (own booking or admin)
    |
    */
    Route::apiResource('bookings', BookingController::class);
});
