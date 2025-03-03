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

test('user can login with valid credentials', function () {
    $user = User::create([
        'name' => 'Test User',
        'email' => 'user@example.com',
        'password' => bcrypt('password123'),
        'pseudo' => 'testuser',
    ]);

    $response = $this->postJson('/api/auth/login', [
        'email' => 'user@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'message',
            'user' => [
                'id',
                'name',
                'email',
                'pseudo',
            ],
            'token',
        ]);
});

test('user cannot login with incorrect password', function () {
    User::create([
        'name' => 'Test User',
        'email' => 'user@example.com',
        'password' => bcrypt('password123'),
        'pseudo' => 'testuser',
    ]);

    $response = $this->postJson('/api/auth/login', [
        'email' => 'user@example.com',
        'password' => 'wrongpassword',
    ]);

    $response->assertStatus(422)
        ->assertJson([
            'message' => 'The provided credentials are incorrect.',
        ]);
});

test('user cannot login with non-existent email', function () {
    $response = $this->postJson('/api/auth/login', [
        'email' => 'nonexistent@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(422)
        ->assertJson([
            'message' => 'The provided credentials are incorrect.',
        ]);
});

test('spaces are trimmed from email during login', function () {
    User::create([
        'name' => 'Test User',
        'email' => 'user@example.com',
        'password' => bcrypt('password123'),
        'pseudo' => 'testuser',
    ]);

    $response = $this->postJson('/api/auth/login', [
        'email' => '  user@example.com  ',
        'password' => 'password123',
    ]);

    $response->assertStatus(200);
});

test('login fails with invalid email format', function () {
    $response = $this->postJson('/api/auth/login', [
        'email' => 'invalid-email-format',
        'password' => 'password123',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('email is case-insensitive during login', function () {
    User::create([
        'name' => 'Test User',
        'email' => 'user@example.com',
        'password' => bcrypt('password123'),
        'pseudo' => 'testuser',
    ]);

    $response = $this->postJson('/api/auth/login', [
        'email' => 'USER@EXAMPLE.COM',
        'password' => 'password123',
    ]);

    $response->assertStatus(200);
});

test('login fails with blank email', function () {
    $response = $this->postJson('/api/auth/login', [
        'email' => '',
        'password' => 'password123',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('login fails with blank password', function () {
    $response = $this->postJson('/api/auth/login', [
        'email' => 'user@example.com',
        'password' => '',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['password']);
});
