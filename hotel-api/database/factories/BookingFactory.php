<?php

namespace Database\Factories;

use App\Models\Hotel;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookingFactory extends Factory
{
    public function definition(): array
    {
        $guests_count = fake()->numberBetween(1, 4);
        $guest_names = [];
        for ($i = 0; $i < $guests_count; $i++) {
            $guest_names[] = fake()->name();
        }

        $checkInDate = fake()->dateTimeBetween('now', '+2 months');
        $checkOutDate = fake()->dateTimeBetween(
            $checkInDate->format('Y-m-d H:i:s'),
            $checkInDate->modify('+5 days')->format('Y-m-d H:i:s')
        );

        return [
            'user_id' => User::factory(),
            'hotel_id' => Hotel::factory(),
            'check_in_date' => $checkInDate,
            'check_out_date' => $checkOutDate,
            'guests_count' => $guests_count,
            'guest_names' => $guest_names,
            'status' => fake()->randomElement(['pending', 'confirmed', 'cancelled', 'completed']),
            'special_requests' => fake()->boolean(30) ? fake()->sentence() : null,
            'contact_phone' => fake()->phoneNumber(),
            'total_price' => fake()->randomFloat(2, 100, 1000),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    public function confirmed(): self
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'confirmed',
        ]);
    }

    public function cancelled(): self
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
        ]);
    }

    public function completed(): self
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'check_in_date' => now()->subDays(5),
            'check_out_date' => now()->subDays(2),
        ]);
    }

    public function pending(): self
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }
}
