<?php

namespace Tests\Unit\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Facades\Hash;

uses(TestCase::class, RefreshDatabase::class)->in('Unit/Auth');

beforeEach(function () {
    // Clean up the users table before each test
    User::query()->delete();
});

test('user credentials are validated correctly', function () {
    $user = User::create([
        'name' => 'Test User',
        'email' => 'user@example.com',
        'password' => Hash::make('password123'),
        'pseudo' => 'testuser',
    ]);

    expect(Hash::check('password123', $user->password))->toBeTrue()
        ->and(Hash::check('wrongpassword', $user->password))->toBeFalse();
});

test('user email is stored in lowercase', function () {
    $user = User::create([
        'name' => 'Test User',
        'email' => 'USER@EXAMPLE.COM',
        'password' => Hash::make('password123'),
        'pseudo' => 'testuser',
    ]);

    expect($user->email)->toBe('user@example.com');
});

test('user email is trimmed when stored', function () {
    $user = User::create([
        'name' => 'Test User',
        'email' => '  user@example.com  ',
        'password' => Hash::make('password123'),
        'pseudo' => 'testuser',
    ]);

    expect($user->email)->toBe('user@example.com');
});

test('user can be found by email case-insensitively', function () {
    $user = User::create([
        'name' => 'Test User',
        'email' => 'user@example.com',
        'password' => Hash::make('password123'),
        'pseudo' => 'testuser',
    ]);

    $foundUser = User::whereRaw('LOWER(email) = ?', [strtolower('USER@EXAMPLE.COM')])->first();
    expect($foundUser->id)->toBe($user->id);
});

test('user can be found by trimmed email', function () {
    $user = User::create([
        'name' => 'Test User',
        'email' => 'user@example.com',
        'password' => Hash::make('password123'),
        'pseudo' => 'testuser',
    ]);

    $foundUser = User::whereRaw('LOWER(email) = ?', [strtolower(trim('  user@example.com  '))])->first();
    expect($foundUser->id)->toBe($user->id);
});
