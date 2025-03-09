<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    /**
     * Register a new user.
     *
     * @param RegisterRequest $request
     * @return JsonResponse
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Hash password
        $validated['password'] = Hash::make($validated['password']);

        // Set default role to 'user'
        $validated['role'] = 'user';

        // Create user
        $user = User::create($validated);

        // Create token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    /**
     * Login user and create token.
     *
     * @param LoginRequest $request
     * @return JsonResponse
     * @throws ValidationException
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Normalize the email (trim and lowercase)
        $email = strtolower(trim($validated['email']));

        // Find user by normalized email
        $user = User::whereRaw('LOWER(email) = ?', [strtolower($email)])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Create new token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token
        ]);
    }

    /**
     * Logout user (revoke token).
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user) {
            // Get the current token
            $currentToken = $user->currentAccessToken();

            if ($currentToken) {
                // Delete the current token first to ensure it can't be reused
                $currentToken->delete();

                // Then delete all other tokens for this user
                $user->tokens()->delete();
            }
        }

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    /**
     * Get authenticated user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function user(Request $request): JsonResponse
    {
        $user = $request->user();
        $bearerToken = $request->bearerToken();

        // Check if user exists and has a valid token
        if (!$user || !$bearerToken ||
            !$user->tokens()->where('token', hash('sha256', explode('|', $bearerToken)[1] ?? ''))->exists()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }


        return response()->json($user);
    }
}
