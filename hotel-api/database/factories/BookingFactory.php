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

        $hotel = Hotel::factory()->create(['price_per_night' => 100]);
        $nights = (new \DateTime($checkOutDate->format('Y-m-d')))->diff(new \DateTime($checkInDate->format('Y-m-d')))->days;
        $total_price = $hotel->price_per_night * $nights;

        return [
            'user_id' => User::factory(),
            'hotel_id' => $hotel->id,
            'check_in_date' => $checkInDate,
            'check_out_date' => $checkOutDate,
            'guest_names' => $guest_names,
            'status' => fake()->randomElement(['pending', 'confirmed', 'cancelled', 'completed']),
            'special_requests' => fake()->boolean(30) ? fake()->sentence() : null,
            'contact_phone' => fake()->phoneNumber(),
            'total_price' => $total_price,
            'payment_status' => 'pending',
            'payment_method' => null,
            'transaction_id' => null,
            'paid_at' => null,
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

    public function paid(): self
    {
        return $this->state(function (array $attributes) {
            $transaction_id = 'TRX-' . now()->timestamp . '-' . fake()->randomNumber(5);
            $paid_at = now();

            return [
                'status' => 'paid',
                'payment_status' => 'completed',
                'payment_method' => fake()->randomElement(['credit_card', 'debit_card', 'paypal']),
                'transaction_id' => $transaction_id,
                'paid_at' => $paid_at,
                'total_price' => $attributes['total_price'] ?? 100.00
            ];
        });
    }

    public function unpaid(): self
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'payment_status' => 'pending',
            'payment_method' => null,
            'transaction_id' => null,
            'paid_at' => null
        ]);
    }
}
