<?php

use App\Models\User;
use App\Models\Booking;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

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

test('user can be created with factory', function () {
    $user = User::factory()->create();

    expect($user)->toBeInstanceOf(User::class)
        ->and($user->role)->toBe('user')
        ->and($user->email)->not->toBeNull()
        ->and($user->name)->not->toBeNull()
        ->and($user->pseudo)->not->toBeNull();
});

test('user can be assigned different roles', function () {
    $admin = User::factory()->admin()->create();
    $employee = User::factory()->employee()->create();
    $user = User::factory()->user()->create();

    expect($admin->role)->toBe('admin')
        ->and($employee->role)->toBe('employee')
        ->and($user->role)->toBe('user');
});

test('user has required attributes', function () {
    $user = new User();

    expect($user->getFillable())->toContain('name')
        ->toContain('email')
        ->toContain('password')
        ->toContain('pseudo')
        ->toContain('role');
});
