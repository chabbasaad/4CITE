<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // First seed users since they're needed for bookings
        $this->call(UserSeeder::class);

        // Then seed hotels since they're needed for bookings
        $this->call(HotelSeeder::class);

        // Finally seed bookings since they depend on both users and hotels
        $this->call(BookingSeeder::class);
    }
}
