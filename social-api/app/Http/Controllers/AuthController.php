<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Auth\Events\Verified;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|string|in:admin,content_creator,user',
        ]);

        // Check if the user already exists
        $existingUser = User::where('email', $validated['email'])->first();

        if ($existingUser) {
            if ($existingUser->hasVerifiedEmail()) {
                return response()->json(['message' => 'This email is already registered and verified. Please log in.'], 400);
            } else {
                // Resend verification email if the user exists but is not verified
                $existingUser->sendEmailVerificationNotification();
                return response()->json(['message' => 'This email is already registered but not verified. A new verification email has been sent.'], 400);
            }
        }

        // Create a new user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);


        $user->assignRole($validated['role']);

        // Send verification email
        $user->sendEmailVerificationNotification();

        return response()->json(['message' => 'Registration successful. Please check your email to verify your account.'], 201);
    }

    public function login(Request $request)
    {
        // Validate login credentials
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if (!Auth::attempt($validated)) {
            return response()->json(['message' => 'Invalid login details'], 401);
        }

        // Fetch the authenticated user
        $user = User::where('email', $validated['email'])->firstOrFail();

         // Check if the user's email is verified
        if (!$user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Your email address is not verified. Please verify your email before logging in.'], 403);
        }
        // Generate access token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Get additional data
        $additionalData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'posts_count' => $user->posts()->count(),
            'followers_count' => $user->followers()->count(),
            'following_count' => $user->following()->count(),
        ];

        // Return response with token and user data
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $additionalData,
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Successfully logged out']);
    }

    public function verifyEmail(Request $request)
    {
        $user = User::findOrFail($request->route('id'));

        if (!hash_equals((string) $request->route('hash'), sha1($user->email))) {
            return response()->json(['message' => 'Invalid verification link'], 403);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified'], 400);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));

            // Generate and return token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Email successfully verified.',
                'access_token' => $token,
                'token_type' => 'Bearer',
            ], 200);
        }

        return response()->json(['message' => 'Failed to verify email.'], 500);
    }

    public function resendVerificationEmail(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified'], 400);
        }

        $user->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification email resent'], 200);
    }

}
