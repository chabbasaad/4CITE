<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class HotelFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->company() . ' Hotel',
            'description' => fake()->paragraph(),
            'location' => fake()->city(),
            'price_per_night' => fake()->numberBetween(50, 500),
            'is_available' => fake()->boolean(80), // 80% chance of being available
            'amenities' => [
                'wifi' => fake()->boolean(90),
                'parking' => fake()->boolean(70),
                'pool' => fake()->boolean(50),
                'spa' => fake()->boolean(30),
                'restaurant' => fake()->boolean(60),
                'room_service' => fake()->boolean(80),
                'fitness_center' => fake()->boolean(40),
                'conference_room' => fake()->boolean(30),
            ],
            'total_rooms' => fake()->numberBetween(10, 200),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    public function unavailable(): self
    {
        return $this->state(fn (array $attributes) => [
            'is_available' => false,
        ]);
    }

    public function luxury(): self
    {
        return $this->state(fn (array $attributes) => [
            'price_per_night' => fake()->numberBetween(300, 1000),
            'amenities' => [
                'wifi' => true,
                'parking' => true,
                'pool' => true,
                'spa' => true,
                'restaurant' => true,
                'room_service' => true,
                'fitness_center' => true,
                'conference_room' => true,
            ],
        ]);
    }
}
