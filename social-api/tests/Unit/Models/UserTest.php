<?php

use App\Models\User;
use App\Models\Booking;
use Illuminate\Support\Facades\Hash;

test('user has correct role', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $employee = User::factory()->create(['role' => 'employee']);
    $user = User::factory()->create(['role' => 'user']);

    expect($admin->isAdmin())->toBeTrue();
    expect($employee->isEmployee())->toBeTrue();
    expect($user->isUser())->toBeTrue();
});

test('user has bookings relationship', function () {
    $user = User::factory()->create();
    $booking = Booking::factory()->create(['user_id' => $user->id]);

    expect($user->bookings)->toHaveCount(1);
    expect($user->bookings->first())->toBeInstanceOf(Booking::class);
});

test('user password is hashed', function () {
    $user = User::factory()->create([
        'password' => 'password'
    ]);

    expect($user->password)->not->toBe('password');
    expect(Hash::check('password', $user->password))->toBeTrue();
});

test('user has correct default role', function () {
    $user = User::factory()->create();

    expect($user->role)->toBe('user');
});
