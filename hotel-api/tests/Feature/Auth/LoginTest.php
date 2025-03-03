<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Testing\Fluent\AssertableJson;

test('user can login with correct credentials', function () {
    $user = User::factory()->create([
        'email' => 'user@example.com',
        'password' => Hash::make('password123')
    ]);

    $response = $this->postJson('/api/auth/login', [
        'email' => 'user@example.com',
        'password' => 'password123'
    ]);

    $response->assertStatus(200)
        ->assertJson(fn (AssertableJson $json) =>
            $json->has('token')
                ->has('user')
                ->where('message', 'Login successful')
                ->where('user.email', $user->email)
        );
});

test('user cannot login with incorrect password', function () {
    $user = User::factory()->create();

    $response = $this->postJson('/api/auth/login', [
        'email' => $user->email,
        'password' => 'wrongpassword'
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('user cannot login with non-existent email', function () {
    $response = $this->postJson('/api/auth/login', [
        'email' => 'nonexistent@example.com',
        'password' => 'password123'
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});
