<?php

use App\Models\Booking;
use App\Models\Hotel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('user can create a booking', function () {
    // Clear any existing bookings
    \App\Models\Booking::query()->delete();

    $user = User::factory()->create();
    $hotel = Hotel::factory()->create(['is_available' => true]);

    $response = $this->actingAs($user)->postJson('/api/bookings', [
        'hotel_id' => $hotel->id,
        'check_in_date' => now()->addDays(1)->format('Y-m-d'),
        'check_out_date' => now()->addDays(3)->format('Y-m-d'),
        'guest_names' => ['John Doe', 'Jane Doe'],
        'contact_phone' => '1234567890'
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'message',
            'data' => [
                'id',
                'hotel_id',
                'user_id',
                'check_in_date',
                'check_out_date',
                'guests_count',
                'guest_names',
                'total_price',
                'status'
            ]
        ]);

    $this->assertDatabaseHas('bookings', [
        'hotel_id' => $hotel->id,
        'user_id' => $user->id,
        'guests_count' => 2
    ]);
});

test('user can only view own bookings', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $hotel = Hotel::factory()->create(['is_available' => true]);

    // Create bookings for both users
    Booking::factory()->create(['user_id' => $user1->id, 'hotel_id' => $hotel->id]);
    Booking::factory()->create(['user_id' => $user2->id, 'hotel_id' => $hotel->id]);

    // User1 should only see their booking
    $response = $this->actingAs($user1)->getJson('/api/bookings');
    $response->assertStatus(200)
        ->assertJsonCount(1, 'data');
});

test('employee can view all bookings', function () {
    // Clear any existing bookings
    \App\Models\Booking::query()->delete();

    $hotel = Hotel::factory()->create(['is_available' => true]);
    Booking::factory()->count(6)->create(['hotel_id' => $hotel->id]);

    $response = actingAsEmployee()->getJson('/api/bookings');

    $response->assertStatus(200)
        ->assertJsonCount(6, 'data');
});

test('admin can view all bookings', function () {
    // Clear any existing bookings
    \App\Models\Booking::query()->delete();

    $hotel = Hotel::factory()->create(['is_available' => true]);
    Booking::factory()->count(9)->create(['hotel_id' => $hotel->id]);

    $response = actingAsAdmin()->getJson('/api/bookings');

    $response->assertStatus(200)
        ->assertJsonCount(9, 'data');
});

test('user can update own booking', function () {
    $user = User::factory()->create();
    $hotel = Hotel::factory()->create(['is_available' => true]);
    $booking = Booking::factory()->create([
        'user_id' => $user->id,
        'hotel_id' => $hotel->id,
        'guest_names' => ['John Doe', 'Jane Doe'],
        'guests_count' => 2
    ]);

    $response = $this->actingAs($user)
        ->putJson("/api/bookings/{$booking->id}", [
            'guest_names' => ['John Doe', 'Jane Doe', 'Jim Doe'],
            'special_requests' => 'Late check-out needed'
        ]);

    $response->assertStatus(200);
    expect($booking->fresh()->guests_count)->toBe(3);
});

test('user cannot update others booking', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $hotel = Hotel::factory()->create(['is_available' => true]);
    $booking = Booking::factory()->create([
        'user_id' => $user2->id,
        'hotel_id' => $hotel->id
    ]);

    $response = $this->actingAs($user1)
        ->putJson("/api/bookings/{$booking->id}", [
            'guests_count' => 3
        ]);

    $response->assertStatus(403);
});

test('booking validation works', function () {
    $user = User::factory()->create();
    $hotel = Hotel::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/bookings', [
        'hotel_id' => $hotel->id,
        'check_in_date' => now()->subDay()->format('Y-m-d'),
        'check_out_date' => now()->format('Y-m-d'),
        'guest_names' => []
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors([
            'check_in_date',
            'guest_names',
            'contact_phone'
        ]);
});
