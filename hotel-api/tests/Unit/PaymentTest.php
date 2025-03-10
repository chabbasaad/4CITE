<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Booking;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    public function test_booking_has_payment_status()
    {
        $booking = Booking::factory()->create([
            'payment_status' => 'pending'
        ]);

        $this->assertEquals('pending', $booking->payment_status);
    }

    public function test_booking_has_payment_method()
    {
        $booking = Booking::factory()->create([
            'payment_method' => 'credit_card'
        ]);

        $this->assertEquals('credit_card', $booking->payment_method);
    }

    public function test_booking_has_transaction_id()
    {
        $booking = Booking::factory()->create([
            'transaction_id' => 'TRX-123456'
        ]);

        $this->assertEquals('TRX-123456', $booking->transaction_id);
    }

    public function test_booking_has_paid_at_timestamp()
    {
        $now = Carbon::now();
        $booking = Booking::factory()->create([
            'paid_at' => $now
        ]);

        $this->assertEquals($now->timestamp, $booking->paid_at->timestamp);
    }

    public function test_booking_payment_status_is_pending_by_default()
    {
        $booking = Booking::factory()->create();

        $this->assertEquals('pending', $booking->payment_status);
    }

    public function test_booking_can_be_marked_as_paid()
    {
        $booking = Booking::factory()->create([
            'status' => 'pending',
            'payment_status' => 'pending'
        ]);

        $booking->markAsPaid('credit_card', 'TRX-123456');

        $this->assertEquals('paid', $booking->status);
        $this->assertEquals('completed', $booking->payment_status);
        $this->assertEquals('credit_card', $booking->payment_method);
        $this->assertEquals('TRX-123456', $booking->transaction_id);
        $this->assertNotNull($booking->paid_at);
    }

    public function test_booking_payment_requires_authorization()
    {
        $user = User::factory()->create(['role' => 'user']);
        $otherUser = User::factory()->create(['role' => 'user']);
        $staff = User::factory()->create(['role' => 'employee']);

        $booking = Booking::factory()->create([
            'user_id' => $user->id
        ]);

        $this->assertTrue($booking->canProcessPayment($user));
        $this->assertFalse($booking->canProcessPayment($otherUser));
        $this->assertTrue($booking->canProcessPayment($staff));
    }

    public function test_booking_payment_validation_rules()
    {
        $booking = new Booking();
        $rules = $booking->getPaymentValidationRules();

        $this->assertArrayHasKey('payment_method', $rules);
        $this->assertArrayHasKey('card_number', $rules);
        $this->assertArrayHasKey('expiry_date', $rules);
        $this->assertArrayHasKey('cvv', $rules);
    }

    public function test_booking_can_generate_transaction_id()
    {
        $booking = Booking::factory()->create();
        $transactionId = $booking->generateTransactionId();

        $this->assertStringStartsWith('TRX-', $transactionId);
        $this->assertStringContainsString((string)$booking->id, $transactionId);
    }

    public function test_booking_payment_amount_matches_total_price()
    {
        $booking = Booking::factory()->create([
            'total_price' => 150.00
        ]);

        $this->assertEquals(150.00, $booking->getPaymentAmount());
    }
}
