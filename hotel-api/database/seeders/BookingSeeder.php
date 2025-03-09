<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Hotel;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('role', 'user')->get();
        $hotels = Hotel::all();

        // Create upcoming bookings
        foreach ($users as $index => $user) {
            // Each user gets 2-3 upcoming bookings
            $numBookings = rand(2, 3);

            for ($i = 0; $i < $numBookings; $i++) {
                $hotel = $hotels->random();
                $checkIn = Carbon::now()->addDays(rand(1, 30));
                $checkOut = (clone $checkIn)->addDays(rand(1, 7));

                Booking::create([
                    'user_id' => $user->id,
                    'hotel_id' => $hotel->id,
                    'check_in_date' => $checkIn,
                    'check_out_date' => $checkOut,
                    'guests_count' => rand(1, 4),
                    'status' => 'confirmed',
                    'special_requests' => $this->getRandomSpecialRequest(),
                    'guest_names' => [$user->name, 'Guest '.rand(1, 100)],
                    'contact_phone' => '+1'.rand(1000000000, 9999999999),
                ]);
            }
        }

        // Create past bookings
        foreach ($users as $user) {
            // Each user gets 1-2 past bookings
            $numBookings = rand(1, 2);

            for ($i = 0; $i < $numBookings; $i++) {
                $hotel = $hotels->random();
                $checkIn = Carbon::now()->subDays(rand(10, 60));
                $checkOut = (clone $checkIn)->addDays(rand(1, 7));

                Booking::create([
                    'user_id' => $user->id,
                    'hotel_id' => $hotel->id,
                    'check_in_date' => $checkIn,
                    'check_out_date' => $checkOut,
                    'guests_count' => rand(1, 4),
                    'status' => 'completed',
                    'special_requests' => $this->getRandomSpecialRequest(),
                    'guest_names' => [$user->name],
                    'contact_phone' => '+1'.rand(1000000000, 9999999999),
                ]);
            }
        }

        // Create some cancelled bookings
        foreach ($users->random(5) as $user) {
            $hotel = $hotels->random();
            $checkIn = Carbon::now()->addDays(rand(5, 20));
            $checkOut = (clone $checkIn)->addDays(rand(1, 7));

            Booking::create([
                'user_id' => $user->id,
                'hotel_id' => $hotel->id,
                'check_in_date' => $checkIn,
                'check_out_date' => $checkOut,
                'guests_count' => rand(1, 4),
                'status' => 'cancelled',
                'special_requests' => $this->getRandomSpecialRequest(),
                'guest_names' => [$user->name],
                'contact_phone' => '+1'.rand(1000000000, 9999999999),
            ]);
        }
    }

    private function getRandomSpecialRequest(): string
    {
        $requests = [
            'Early check-in requested',
            'Late check-out requested',
            'Extra pillows needed',
            'Room with a view preferred',
            'High floor requested',
            'Quiet room preferred',
            'Allergic to feathers - synthetic pillows required',
            'Birthday celebration during stay',
            'Anniversary celebration',
            'Need baby crib',
        ];

        return $requests[array_rand($requests)];
    }
}
