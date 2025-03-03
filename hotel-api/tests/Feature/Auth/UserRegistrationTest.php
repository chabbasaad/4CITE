<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class)->in('Feature/Auth');

beforeEach(function () {
    // Clean up the users table before each test
    User::query()->delete();
});

test('user can successfully register with valid data', function () {
    $userData = [
        'name' => 'Saad chabba',
        'email' => 'saad.chabba@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'pseudo' => 'Saadchabba',
    ];

    $response = $this->postJson('/api/auth/register', $userData);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'message',
            'user' => [
                'id',
                'name',
                'email',
                'pseudo',
                'created_at',
                'updated_at',
            ],
        ]);

    $this->assertDatabaseHas('users', [
        'email' => $userData['email'],
        'name' => $userData['name'],
        'pseudo' => $userData['pseudo'],
    ]);
});

test('user cannot register with existing email', function () {
    // Create existing user
    User::create([
        'name' => 'Existing User',
        'email' => 'existing@example.com',
        'password' => bcrypt('Password123!'),
        'pseudo' => 'existinguser',
    ]);

    $userData = [
        'name' => 'New User',
        'email' => 'existing@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'pseudo' => 'newuser',
    ];

    $response = $this->postJson('/api/auth/register', $userData);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('user cannot register with invalid data', function () {
    $invalidData = [
        'name' => '',
        'email' => 'invalid-email',
        'password' => 'short',
        'password_confirmation' => 'different',
        'pseudo' => 'a', // too short
    ];

    $response = $this->postJson('/api/auth/register', $invalidData);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'email', 'password', 'pseudo']);
});

test('user cannot register with weak password', function () {
    $userData = [
        'name' => 'Saad chabba',
        'email' => 'saad.chabba@example.com',
        'password' => 'weakpass',
        'password_confirmation' => 'weakpass',
        'pseudo' => 'Saadchabba',
    ];

    $response = $this->postJson('/api/auth/register', $userData);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['password']);
});

test('user cannot register with duplicate pseudo', function () {
    // Create existing user
    User::create([
        'name' => 'Existing User',
        'email' => 'existing@example.com',
        'password' => bcrypt('Password123!'),
        'pseudo' => 'saadchabba',
    ]);

    $userData = [
        'name' => 'New User',
        'email' => 'new@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'pseudo' => 'saadchabba',
    ];

    $response = $this->postJson('/api/auth/register', $userData);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['pseudo']);
});

test('email is trimmed during registration', function () {
    $userData = [
        'name' => 'Saad chabba',
        'email' => '  saad.chabba@example.com  ',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'pseudo' => 'Saadchabba',
    ];

    $response = $this->postJson('/api/auth/register', $userData);

    $response->assertStatus(201);

    $this->assertDatabaseHas('users', [
        'email' => trim($userData['email']),
    ]);
});

test('user cannot register with special characters in name', function () {
    $userData = [
        'name' => 'Saad@123',
        'email' => 'saad.chabba@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'pseudo' => 'Saadchabba',
    ];

    $response = $this->postJson('/api/auth/register', $userData);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name']);
});

test('user cannot register with password matching email or name', function () {
    $userData = [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'john@example.com',
        'password_confirmation' => 'john@example.com',
        'pseudo' => 'johndoe',
    ];

    $response = $this->postJson('/api/auth/register', $userData);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['password']);
});

test('user cannot register with very long inputs', function () {
    $userData = [
        'name' => str_repeat('a', 256),
        'email' => str_repeat('a', 246) . '@example.com',
        'password' => str_repeat('A', 101) . '123!',
        'password_confirmation' => str_repeat('A', 101) . '123!',
        'pseudo' => str_repeat('a', 51),
    ];

    $response = $this->postJson('/api/auth/register', $userData);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'email', 'password', 'pseudo']);
});

test('user cannot register with spaces in pseudo', function () {
    $userData = [
        'name' => 'Saad chabba',
        'email' => 'saad.chabba@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'pseudo' => 'saad chabba',
    ];

    $response = $this->postJson('/api/auth/register', $userData);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['pseudo']);
});

test('user cannot register with password containing spaces', function () {
    $userData = [
        'name' => 'Saad chabba',
        'email' => 'saad.chabba@example.com',
        'password' => 'Password 123!',
        'password_confirmation' => 'Password 123!',
        'pseudo' => 'Saadchabba',
    ];

    $response = $this->postJson('/api/auth/register', $userData);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['password']);
});
