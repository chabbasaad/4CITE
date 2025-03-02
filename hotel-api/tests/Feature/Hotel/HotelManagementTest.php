<?php

use App\Models\Hotel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guest can view all hotels', function () {
    // Clear any existing hotels
    Hotel::query()->delete();

    Hotel::factory()->count(3)->create();

    $response = $this->getJson('/api/hotels');

    $response->assertStatus(200)
        ->assertJsonCount(3, 'data');
});

test('guest can view single hotel', function () {
    $hotel = Hotel::factory()->create();

    $response = $this->getJson("/api/hotels/{$hotel->id}");

    $response->assertStatus(200)
        ->assertJsonStructure(['data'])
        ->assertJson([
            'data' => [
                'id' => $hotel->id,
                'name' => $hotel->name
            ]
        ]);
});

test('only admin can create hotel', function () {
    // Clear any existing hotels
    Hotel::query()->delete();

    $hotelData = Hotel::factory()->raw();

    // Test as regular user
    actingAsUser()
        ->postJson('/api/hotels', $hotelData)
        ->assertStatus(403);

    // Test as employee
    actingAsEmployee()
        ->postJson('/api/hotels', $hotelData)
        ->assertStatus(403);

    // Test as admin
    $response = actingAsAdmin()
        ->postJson('/api/hotels', $hotelData);

    $response->assertStatus(201);
    expect(Hotel::count())->toBe(1);
});

test('only admin can update hotel', function () {
    $hotel = Hotel::factory()->create();
    $updateData = ['name' => 'Updated Hotel Name'];

    // Test as regular user
    actingAsUser()
        ->putJson("/api/hotels/{$hotel->id}", $updateData)
        ->assertStatus(403);

    // Test as employee
    actingAsEmployee()
        ->putJson("/api/hotels/{$hotel->id}", $updateData)
        ->assertStatus(403);

    // Test as admin
    actingAsAdmin()
        ->putJson("/api/hotels/{$hotel->id}", $updateData)
        ->assertStatus(200);

    expect($hotel->fresh()->name)->toBe('Updated Hotel Name');
});

test('only admin can delete hotel', function () {
    // Clear any existing hotels
    Hotel::query()->delete();

    $hotel = Hotel::factory()->create();

    // Test as regular user
    actingAsUser()
        ->deleteJson("/api/hotels/{$hotel->id}")
        ->assertStatus(403);

    // Test as employee
    actingAsEmployee()
        ->deleteJson("/api/hotels/{$hotel->id}")
        ->assertStatus(403);

    // Test as admin
    actingAsAdmin()
        ->deleteJson("/api/hotels/{$hotel->id}")
        ->assertStatus(200);

    expect(Hotel::count())->toBe(0);
});

test('hotel search works correctly', function () {
    // Clear any existing hotels
    Hotel::query()->delete();

    // Create hotels with specific names for testing search
    Hotel::factory()->create(['name' => 'Luxury Beach Resort']);
    Hotel::factory()->create(['name' => 'City Center Hotel']);
    Hotel::factory()->create(['name' => 'Mountain View Lodge']);

    // Search for 'Luxury'
    $response = $this->getJson('/api/hotels?search=Luxury');

    $response->assertStatus(200)
        ->assertJsonCount(1, 'data')
        ->assertJson([
            'data' => [
                [
                    'name' => 'Luxury Beach Resort'
                ]
            ]
        ]);

    // Search by location
    $response = $this->getJson('/api/hotels?search=Mountain');

    $response->assertStatus(200)
        ->assertJsonCount(1, 'data')
        ->assertJson([
            'data' => [
                [
                    'name' => 'Mountain View Lodge'
                ]
            ]
        ]);
});
