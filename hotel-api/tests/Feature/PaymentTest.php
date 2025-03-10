<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Hotel;
use App\Models\Booking;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    private function getValidPaymentData()
    {
        return [
            'payment_method' => 'credit_card',
            'card_number' => '1234567890123456',
            'expiry_date' => '12/25',
            'cvv' => '123'
        ];
    }

    public function test_user_can_process_payment_for_own_booking()
    {
        $user = User::factory()->create(['role' => 'user']);
        $booking = Booking::factory()->create([
            'user_id' => $user->id,
            'status' => 'pending',
            'payment_status' => 'pending'
        ]);

        $response = $this->actingAs($user)
            ->postJson("/api/bookings/{$booking->id}/process-payment", $this->getValidPaymentData());

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Payment processed successfully',
                'data' => [
                    'booking_id' => $booking->id,
                    'status' => 'completed'
                ]
            ]);

        $this->assertDatabaseHas('bookings', [
            'id' => $booking->id,
            'status' => 'paid',
            'payment_status' => 'completed',
            'payment_method' => 'credit_card'
        ]);
    }

    public function test_user_cannot_process_payment_for_others_booking()
    {
        $user = User::factory()->create(['role' => 'user']);
        $otherUser = User::factory()->create(['role' => 'user']);
        $booking = Booking::factory()->create([
            'user_id' => $otherUser->id,
            'status' => 'pending'
        ]);

        $response = $this->actingAs($user)
            ->postJson("/api/bookings/{$booking->id}/process-payment", $this->getValidPaymentData());

        $response->assertStatus(403);
    }

    public function test_staff_can_process_payment_for_any_booking()
    {
        $staff = User::factory()->create(['role' => 'employee']);
        $booking = Booking::factory()->create([
            'status' => 'pending',
            'payment_status' => 'pending'
        ]);

        $response = $this->actingAs($staff)
            ->postJson("/api/bookings/{$booking->id}/process-payment", $this->getValidPaymentData());

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Payment processed successfully'
            ]);
    }

    public function test_payment_requires_valid_payment_method()
    {
        $user = User::factory()->create(['role' => 'user']);
        $booking = Booking::factory()->create([
            'user_id' => $user->id,
            'status' => 'pending'
        ]);

        $invalidData = $this->getValidPaymentData();
        $invalidData['payment_method'] = 'invalid_method';

        $response = $this->actingAs($user)
            ->postJson("/api/bookings/{$booking->id}/process-payment", $invalidData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['payment_method']);
    }

    public function test_credit_card_payment_requires_valid_card_details()
    {
        $user = User::factory()->create(['role' => 'user']);
        $booking = Booking::factory()->create([
            'user_id' => $user->id,
            'status' => 'pending'
        ]);

        $invalidData = [
            'payment_method' => 'credit_card',
            'card_number' => '123', // Invalid card number
            'expiry_date' => '13/25', // Invalid expiry
            'cvv' => '12' // Invalid CVV
        ];

        $response = $this->actingAs($user)
            ->postJson("/api/bookings/{$booking->id}/process-payment", $invalidData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['card_number', 'cvv']);
    }

    public function test_paypal_payment_does_not_require_card_details()
    {
        $user = User::factory()->create(['role' => 'user']);
        $booking = Booking::factory()->create([
            'user_id' => $user->id,
            'status' => 'pending'
        ]);

        $paypalData = [
            'payment_method' => 'paypal'
        ];

        $response = $this->actingAs($user)
            ->postJson("/api/bookings/{$booking->id}/process-payment", $paypalData);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Payment processed successfully'
            ]);
    }

    public function test_payment_generates_unique_transaction_id()
    {
        $user = User::factory()->create(['role' => 'user']);
        $booking1 = Booking::factory()->create(['user_id' => $user->id, 'status' => 'pending']);
        $booking2 = Booking::factory()->create(['user_id' => $user->id, 'status' => 'pending']);

        $response1 = $this->actingAs($user)
            ->postJson("/api/bookings/{$booking1->id}/process-payment", $this->getValidPaymentData());
        $response2 = $this->actingAs($user)
            ->postJson("/api/bookings/{$booking2->id}/process-payment", $this->getValidPaymentData());

        $transactionId1 = $response1->json('data.transaction_id');
        $transactionId2 = $response2->json('data.transaction_id');

        $this->assertNotEquals($transactionId1, $transactionId2);
    }

    public function test_payment_records_timestamp()
    {
        $user = User::factory()->create(['role' => 'user']);
        $booking = Booking::factory()->create([
            'user_id' => $user->id,
            'status' => 'pending'
        ]);

        $response = $this->actingAs($user)
            ->postJson("/api/bookings/{$booking->id}/process-payment", $this->getValidPaymentData());

        $response->assertStatus(200);

        $this->assertNotNull($booking->fresh()->paid_at);
        $this->assertInstanceOf(Carbon::class, $booking->fresh()->paid_at);
    }
}
