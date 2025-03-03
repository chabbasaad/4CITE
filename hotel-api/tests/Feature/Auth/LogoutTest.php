<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;
use Laravel\Sanctum\PersonalAccessToken;

uses(TestCase::class, RefreshDatabase::class)->in('Feature/Auth');

beforeEach(function () {
    // Clean up the users table and tokens before each test
    PersonalAccessToken::query()->delete();
    User::query()->delete();
});

test('authenticated user can logout successfully', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test-token')->plainTextToken;

    $response = $this->withHeader('Authorization', 'Bearer ' . $token)
        ->postJson('/api/auth/logout');

    $response->assertStatus(200)
        ->assertJson([
            'message' => 'Successfully logged out'
        ]);

    // Verify that the token was deleted
    expect($user->tokens()->count())->toBe(0);
});

test('logged out user cannot access protected routes', function () {
    $user = User::factory()->create();

    // First login to get a token
    $loginResponse = $this->postJson('/api/auth/login', [
        'email' => $user->email,
        'password' => 'password' // default password from factory
    ]);

    $token = $loginResponse->json('token');

    // Logout
    $this->withHeader('Authorization', 'Bearer ' . $token)
        ->postJson('/api/auth/logout');

    // Try to access protected route
    $response = $this->withHeader('Authorization', 'Bearer ' . $token)
        ->getJson('/api/auth/user');

    $response->assertStatus(401);
});

test('unauthenticated user cannot logout', function () {
    $response = $this->postJson('/api/auth/logout');

    $response->assertStatus(401);
});

test('all tokens are revoked after logout', function () {
    PersonalAccessToken::query()->delete(); // Ensure clean state

    $user = User::factory()->create();

    // Create multiple tokens
    $token1 = $user->createToken('token1')->plainTextToken;
    $token2 = $user->createToken('token2')->plainTextToken;
    $token3 = $user->createToken('token3')->plainTextToken;

    expect($user->tokens()->count())->toBe(3);

    $response = $this->withHeader('Authorization', 'Bearer ' . $token1)
        ->postJson('/api/auth/logout');

    $response->assertStatus(200);
    expect($user->tokens()->count())->toBe(0);
});

test('logged out user token cannot be reused', function () {
    $user = User::factory()->create();

    // Create token directly instead of logging in
    $token = $user->createToken('test-token')->plainTextToken;

    // Use token to access protected route
    $beforeLogout = $this->withHeader('Authorization', 'Bearer ' . $token)
        ->getJson('/api/auth/user');
    $beforeLogout->assertStatus(200);

    // Logout
    $this->withHeader('Authorization', 'Bearer ' . $token)
        ->postJson('/api/auth/logout');

    // Try to use the same token
    $afterLogout = $this->withHeader('Authorization', 'Bearer ' . $token)
        ->getJson('/api/auth/user');
    $afterLogout->assertStatus(401);
});

test('multiple devices can be logged out simultaneously', function () {
    PersonalAccessToken::query()->delete(); // Ensure clean state

    $user = User::factory()->create();

    // Create tokens for multiple devices
    $token1 = $user->createToken('device1')->plainTextToken;
    $token2 = $user->createToken('device2')->plainTextToken;
    $token3 = $user->createToken('device3')->plainTextToken;

    expect($user->tokens()->count())->toBe(3);

    // Logout from one device
    $this->withHeader('Authorization', 'Bearer ' . $token1)
        ->postJson('/api/auth/logout');

    // All devices should be logged out
    expect($user->tokens()->count())->toBe(0);

    // Try to use tokens from other devices
    $this->withHeader('Authorization', 'Bearer ' . $token2)
        ->getJson('/api/auth/user')
        ->assertStatus(401);

    $this->withHeader('Authorization', 'Bearer ' . $token3)
        ->getJson('/api/auth/user')
        ->assertStatus(401);
});
