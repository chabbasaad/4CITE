<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;
use Laravel\Sanctum\NewAccessToken;

test('password hashing works correctly', function () {
    $password = 'password123';
    $hashedPassword = Hash::make($password);

    expect(Hash::check($password, $hashedPassword))->toBeTrue()
        ->and(Hash::check('wrong_password', $hashedPassword))->toBeFalse();
});

test('sanctum token can be created and verified', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test-token');

    expect($token)->toBeInstanceOf(NewAccessToken::class)
        ->and($token->plainTextToken)->not->toBeNull()
        ->and($token->accessToken)->toBeInstanceOf(PersonalAccessToken::class)
        ->and($user->tokens()->count())->toBe(1);
});

test('user tokens can be revoked', function () {
    $user = User::factory()->create();
    $user->createToken('test-token');

    expect($user->tokens()->count())->toBe(1);

    $user->tokens()->delete();

    expect($user->tokens()->count())->toBe(0);
});

test('user credentials can be validated', function () {
    $password = 'password123';
    $user = User::factory()->create([
        'password' => Hash::make($password)
    ]);

    expect(Hash::check($password, $user->password))->toBeTrue()
        ->and(Hash::check('wrong_password', $user->password))->toBeFalse();
});
