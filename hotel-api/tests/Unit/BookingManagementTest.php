<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Hotel;
use App\Models\Booking;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;

class BookingManagementTest extends TestCase
{
    use RefreshDatabase;

    // Model Relationship Tests
    public function test_booking_belongs_to_user()
    {
        $user = User::factory()->create();
        $booking = Booking::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $booking->user);
        $this->assertEquals($user->id, $booking->user->id);
    }

    public function test_booking_belongs_to_hotel()
    {
        $hotel = Hotel::factory()->create();
        $booking = Booking::factory()->create(['hotel_id' => $hotel->id]);

        $this->assertInstanceOf(Hotel::class, $booking->hotel);
        $this->assertEquals($hotel->id, $booking->hotel->id);
    }

    public function test_user_has_many_bookings()
    {
        $user = User::factory()->create();
        $bookings = Booking::factory()->count(3)->create(['user_id' => $user->id]);

        $this->assertCount(3, $user->bookings);
        $this->assertInstanceOf(Booking::class, $user->bookings->first());
    }

    // Validation Tests
    public function test_booking_requires_valid_dates()
    {
        $this->expectException(\Illuminate\Validation\ValidationException::class);

        $bookingData = [
            'check_in_date' => '2024-04-20',
            'check_out_date' => '2024-04-15' // Invalid: check-out before check-in
        ];

        $validator = \Illuminate\Support\Facades\Validator::make($bookingData, [
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after:check_in_date'
        ]);

        if ($validator->fails()) {
            throw new \Illuminate\Validation\ValidationException($validator);
        }
    }

    public function test_booking_requires_valid_guest_count()
    {
        $this->expectException(\Illuminate\Validation\ValidationException::class);

        $bookingData = [
            'guest_names' => array_fill(0, 11, 'Guest Name'), // Too many guests
            'hotel_id' => 1
        ];

        $validator = \Illuminate\Support\Facades\Validator::make($bookingData, [
            'guest_names' => 'required|array|max:10',
            'hotel_id' => 'required|exists:hotels,id'
        ]);

        if ($validator->fails()) {
            throw new \Illuminate\Validation\ValidationException($validator);
        }
    }

    // Business Logic Tests
    public function test_booking_total_price_calculation()
    {
        $hotel = Hotel::factory()->create(['price_per_night' => 100]);
        $booking = Booking::factory()->create([
            'hotel_id' => $hotel->id,
            'check_in_date' => '2024-04-15',
            'check_out_date' => '2024-04-20' // 5 nights
        ]);

        $this->assertEquals(500, $booking->total_price); // 5 nights * $100
    }

    public function test_booking_can_be_cancelled_before_48_hours()
    {
        $booking = Booking::factory()->create([
            'check_in_date' => Carbon::now()->addDays(3),
            'status' => 'confirmed'
        ]);

        $this->assertTrue($booking->canBeCancelled());
    }

    public function test_booking_cannot_be_cancelled_within_48_hours()
    {
        $booking = Booking::factory()->create([
            'check_in_date' => Carbon::now()->addHours(47),
            'status' => 'confirmed'
        ]);

        $this->assertFalse($booking->canBeCancelled());
    }

    public function test_admin_can_cancel_booking_anytime()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $booking = Booking::factory()->create([
            'check_in_date' => Carbon::now()->addHour(),
            'status' => 'confirmed'
        ]);

        $this->assertTrue($booking->canBeCancelledByUser($admin));
    }

    // Status Management Tests
    public function test_booking_status_transitions()
    {
        $booking = Booking::factory()->create(['status' => 'pending']);

        $booking->status = 'confirmed';
        $booking->save();
        $this->assertEquals('confirmed', $booking->fresh()->status);

        $booking->status = 'cancelled';
        $booking->save();
        $this->assertEquals('cancelled', $booking->fresh()->status);
    }

    public function test_booking_dates_are_carbon_instances()
    {
        $booking = Booking::factory()->create([
            'check_in_date' => '2024-04-15',
            'check_out_date' => '2024-04-20'
        ]);

        $this->assertInstanceOf(Carbon::class, $booking->check_in_date);
        $this->assertInstanceOf(Carbon::class, $booking->check_out_date);
    }

    // Guest Management Tests
    public function test_booking_guest_names_are_array()
    {
        $booking = Booking::factory()->create([
            'guest_names' => ['John Doe', 'Jane Doe']
        ]);

        $this->assertIsArray($booking->guest_names);
        $this->assertCount(2, $booking->guest_names);
    }

    public function test_booking_guests_count_matches_names()
    {
        $booking = Booking::factory()->create([
            'guest_names' => ['John Doe', 'Jane Doe', 'Jimmy Doe']
        ]);

        $this->assertEquals(count($booking->guest_names), $booking->guests_count);
    }

    // Search and Filter Tests
    public function test_booking_scope_for_user()
    {
        $user = User::factory()->create();
        Booking::factory()->count(3)->create(['user_id' => $user->id]);
        Booking::factory()->count(2)->create();

        $userBookings = Booking::forUser($user)->get();
        $this->assertCount(3, $userBookings);
    }

    public function test_booking_scope_for_date_range()
    {
        Booking::factory()->create(['check_in_date' => '2024-04-15']);
        Booking::factory()->create(['check_in_date' => '2024-05-15']);

        $aprilBookings = Booking::whereBetween('check_in_date', [
            '2024-04-01',
            '2024-04-30'
        ])->get();

        $this->assertCount(1, $aprilBookings);
    }

    // Authorization Tests
    public function test_user_can_manage_own_booking()
    {
        $user = User::factory()->create(['role' => 'user']);
        $booking = Booking::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($booking->canBeAccessedByUser($user));
    }

    public function test_user_cannot_manage_others_booking()
    {
        $user = User::factory()->create(['role' => 'user']);
        $otherUser = User::factory()->create(['role' => 'user']);
        $booking = Booking::factory()->create(['user_id' => $otherUser->id]);

        $this->assertFalse($booking->canBeAccessedByUser($user));
    }

    // New Search Tests
    public function test_search_bookings_by_user_email()
    {
        $user = User::factory()->create(['email' => 'saad@example.com']);
        Booking::factory()->count(2)->create(['user_id' => $user->id]);
        Booking::factory()->count(3)->create();

        $query = Booking::query()->whereHas('user', function ($q) {
            $q->where('email', 'like', '%saad@example.com%');
        });

        $this->assertEquals(2, $query->count());
    }

    public function test_search_bookings_by_hotel_name()
    {
        $hotel = Hotel::factory()->create(['name' => 'Luxury Beach Resort']);
        Booking::factory()->count(2)->create(['hotel_id' => $hotel->id]);
        Booking::factory()->count(3)->create();

        $query = Booking::query()->whereHas('hotel', function ($q) {
            $q->where('name', 'like', '%Luxury Beach Resort%');
        });

        $this->assertEquals(2, $query->count());
    }

    public function test_filter_bookings_by_status()
    {
        Booking::factory()->count(2)->create(['status' => 'cancelled']);
        Booking::factory()->create(['status' => 'confirmed']);
        Booking::factory()->create(['status' => 'pending']);

        $cancelledBookings = Booking::where('status', 'cancelled')->get();
        $this->assertCount(2, $cancelledBookings);
        $this->assertEquals('cancelled', $cancelledBookings[0]->status);
    }

    public function test_combined_search_and_filters()
    {
        $user = User::factory()->create(['name' => 'Saad Ahmed']);
        $hotel = Hotel::factory()->create(['name' => 'Luxury Hotel']);

        // Create matching booking
        Booking::factory()->create([
            'user_id' => $user->id,
            'hotel_id' => $hotel->id,
            'status' => 'confirmed',
            'check_in_date' => '2024-04-15'
        ]);

        // Create non-matching bookings
        Booking::factory()->create([
            'user_id' => $user->id,
            'status' => 'cancelled',
            'check_in_date' => '2024-04-15'
        ]);
        Booking::factory()->create([
            'user_id' => $user->id,
            'status' => 'confirmed',
            'check_in_date' => '2024-05-15'
        ]);

        $query = Booking::query()
            ->whereHas('user', function ($q) {
                $q->where('name', 'like', '%Saad%');
            })
            ->where('status', 'confirmed')
            ->whereBetween('check_in_date', ['2024-04-01', '2024-04-30']);

        $this->assertEquals(1, $query->count());
        $this->assertEquals('confirmed', $query->first()->status);
    }
}
