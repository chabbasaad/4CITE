<?php

namespace Tests\Unit\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Laravel\Sanctum\PersonalAccessToken;

uses(TestCase::class, RefreshDatabase::class)->in('Unit/Auth');

beforeEach(function () {
    // Clean up the users table and tokens before each test
    PersonalAccessToken::query()->delete();
    User::query()->delete();
});

test('user tokens can be created and deleted', function () {
    $user = User::factory()->create();

    $token = $user->createToken('test-token');
    expect($user->tokens()->count())->toBe(1)
        ->and($token->accessToken)->toBeInstanceOf(PersonalAccessToken::class);

    $user->tokens()->delete();
    expect($user->tokens()->count())->toBe(0);
});

test('multiple tokens can be created for single user', function () {
    $user = User::factory()->create();

    $user->createToken('token1');
    $user->createToken('token2');
    $user->createToken('token3');

    expect($user->tokens()->count())->toBe(3)
        ->and($user->tokens()->pluck('name')->toArray())->toBe(['token1', 'token2', 'token3']);
});

test('tokens are unique', function () {
    $user = User::factory()->create();

    $token1 = $user->createToken('test-token')->plainTextToken;
    $token2 = $user->createToken('test-token')->plainTextToken;

    expect($token1)->not->toBe($token2);
});

test('tokens store creation timestamp', function () {
    $user = User::factory()->create();

    $token = $user->createToken('test-token')->accessToken;

    expect($token->created_at)->not->toBeNull()
        ->and($token->created_at->diffInSeconds(now()))->toBeLessThan(5);
});

test('tokens can be found by plain text token', function () {
    $user = User::factory()->create();

    $plainTextToken = $user->createToken('test-token')->plainTextToken;

    $token = PersonalAccessToken::findToken(explode('|', $plainTextToken)[1]);
    expect($token)->not->toBeNull()
        ->and($token->tokenable_id)->toBe($user->id)
        ->and($token->name)->toBe('test-token');
});

test('deleting user also deletes their tokens', function () {
    PersonalAccessToken::query()->delete(); // Ensure clean state

    $user = User::factory()->create();

    $user->createToken('token1');
    $user->createToken('token2');

    expect(PersonalAccessToken::count())->toBe(2);

    $user->delete();

    expect(PersonalAccessToken::count())->toBe(0);
});
