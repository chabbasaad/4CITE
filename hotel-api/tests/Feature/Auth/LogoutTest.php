<?php

use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Auth;

test('authenticated user can logout', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $response = $this->postJson('/api/logout');

    $response->assertStatus(200)
        ->assertJson([
            'message' => 'Successfully logged out'
        ]);

    // Verify token was deleted
    expect($user->tokens()->count())->toBe(0);
});

test('logged out user cannot access protected routes', function () {
    $user = User::factory()->create();

    // Create a token and authenticate
    Sanctum::actingAs($user);

    // Try to access protected route with token (should work)
    $this->getJson('/api/user')
        ->assertStatus(200);

    // Logout
    $this->postJson('/api/logout')
        ->assertStatus(200);

    // Clear the authentication state
    Auth::forgetGuards();

    // Try to access protected route again (should fail)
    $this->getJson('/api/user')
        ->assertStatus(401);
});

test('unauthenticated user cannot logout', function () {
    $response = $this->postJson('/api/logout');

    $response->assertStatus(401);
});
