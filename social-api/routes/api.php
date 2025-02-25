<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\CommentController;

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->middleware('signed')
    ->name('verification.verify');
Route::post('/email/resend', [AuthController::class, 'resendVerificationEmail']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // User Management
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/trashed', [UserController::class, 'trashed']);
    Route::post('/users', [UserController::class, 'store']);
    Route::patch('/users/{id}/restore', [UserController::class, 'restore']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);


});

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // Posts
    Route::apiResource('posts', PostController::class);
    Route::get('posts/trashed', [PostController::class, 'trashed']);
    Route::patch('posts/{id}/restore', [PostController::class, 'restore']);
    Route::get('/media/download/{fileName}', [MediaController::class, 'download']);


    // Comments
    Route::apiResource('comments', CommentController::class);
    Route::get('comments/trashed', [CommentController::class, 'trashed']);
    Route::patch('comments/{id}/restore', [CommentController::class, 'restore']);
    Route::get('/comments/post/{postId}', [CommentController::class, 'getCommentsByPost']);

    // User Profile & Settings
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::post('/users/profile-type', [UserController::class, 'toggleProfileType']);
    Route::get('/users/{id}/public-profile', [UserController::class, 'showPublicProfile']);

    // Follow System
    Route::post('/users/{id}/follow', [FollowController::class, 'follow']);
    Route::post('/users/{id}/unfollow', [FollowController::class, 'unfollow']);
    Route::get('/users/{id}/followers', [FollowController::class, 'followers']);
    Route::get('/users/{id}/following', [FollowController::class, 'following']);

    // Likes
    Route::post('/posts/{id}/toggle-like', [LikeController::class, 'toggle']);
});

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/users/{userId}/posts', [PostController::class, 'getUserPosts']);
