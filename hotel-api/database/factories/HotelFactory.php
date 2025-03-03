<?php

namespace Database\Factories;

use App\Models\Hotel;
use Illuminate\Database\Eloquent\Factories\Factory;

class HotelFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Hotel::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $total_rooms = $this->faker->numberBetween(10, 100);
        return [
            'name' => $this->faker->company() . ' Hotel',
            'location' => $this->faker->city(),
            'description' => $this->faker->paragraph(),
            'price_per_night' => $this->faker->numberBetween(100, 1000),
            'total_rooms' => $total_rooms,
            'available_rooms' => $this->faker->numberBetween(0, $total_rooms),
            'is_available' => $this->faker->boolean(80), // 80% chance of being available
            'amenities' => json_encode([
                'wifi' => true,
                'parking' => true,
                'breakfast' => $this->faker->boolean(),
                'pool' => $this->faker->boolean(),
                'spa' => $this->faker->boolean(),
            ]),
        ];
    }

    /**
     * Indicate that the hotel is available.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function available()
    {
        return $this->state(function (array $attributes) {
            $total_rooms = $attributes['total_rooms'] ?? $this->faker->numberBetween(10, 100);
            return [
                'is_available' => true,
                'total_rooms' => $total_rooms,
                'available_rooms' => $this->faker->numberBetween(1, $total_rooms),
            ];
        });
    }

    /**
     * Indicate that the hotel is unavailable.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function unavailable()
    {
        return $this->state(function (array $attributes) {
            return [
                'is_available' => false,
                'total_rooms' => $this->faker->numberBetween(10, 100),
                'available_rooms' => 0,
            ];
        });
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
