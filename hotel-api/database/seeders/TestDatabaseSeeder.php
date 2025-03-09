<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Hotel;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create test users
        $admin = User::create([
            'name' => 'Test Admin',
            'email' => 'testadmin@example.com',
            'password' => Hash::make('password123'),
            'pseudo' => 'testadmin',
            'role' => 'admin',
        ]);

        $employee = User::create([
            'name' => 'Test Employee',
            'email' => 'testemployee@example.com',
            'password' => Hash::make('password123'),
            'pseudo' => 'testemployee',
            'role' => 'employee',
        ]);

        $user = User::create([
            'name' => 'Test User',
            'email' => 'testuser@example.com',
            'password' => Hash::make('password123'),
            'pseudo' => 'testuser',
            'role' => 'user',
        ]);

        // Create test hotels
        $hotel1 = Hotel::create([
            'name' => 'Test Hotel 1',
            'location' => 'Test Location 1',
            'description' => 'Test Description 1',
            'picture_list' => json_encode(['https://example.com/test1.jpg']),
            'price_per_night' => 100.00,
            'is_available' => true,
            'amenities' => json_encode(['WiFi', 'Pool']),
            'total_rooms' => 10,
        ]);

        $hotel2 = Hotel::create([
            'name' => 'Test Hotel 2',
            'location' => 'Test Location 2',
            'description' => 'Test Description 2',
            'picture_list' => json_encode(['https://example.com/test2.jpg']),
            'price_per_night' => 200.00,
            'is_available' => true,
            'amenities' => json_encode(['WiFi', 'Gym']),
            'total_rooms' => 20,
        ]);

        // Create test bookings
        Booking::create([
            'user_id' => $user->id,
            'hotel_id' => $hotel1->id,
            'check_in_date' => now()->addDays(1),
            'check_out_date' => now()->addDays(3),
            'guests_count' => 2,
            'status' => 'confirmed',
            'special_requests' => 'Test request',
            'guest_names' => json_encode(['Test User', 'Guest']),
            'contact_phone' => '+1234567890',
        ]);

        Booking::create([
            'user_id' => $user->id,
            'hotel_id' => $hotel2->id,
            'check_in_date' => now()->subDays(5),
            'check_out_date' => now()->subDays(2),
            'guests_count' => 1,
            'status' => 'completed',
            'special_requests' => null,
            'guest_names' => json_encode(['Test User']),
            'contact_phone' => '+1234567890',
        ]);
    }
}
