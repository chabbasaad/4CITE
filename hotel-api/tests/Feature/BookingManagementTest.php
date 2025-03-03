<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Hotel;
use App\Models\Booking;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;

class BookingManagementTest extends TestCase
{
    use RefreshDatabase;

    // Booking Listing Tests
    public function test_user_can_view_own_bookings()
    {
        $user = User::factory()->create(['role' => 'user']);
        $otherUser = User::factory()->create(['role' => 'user']);

        // Create bookings for both users
        $userBookings = Booking::factory()->count(3)->create(['user_id' => $user->id]);
        Booking::factory()->count(2)->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)
            ->getJson('/api/bookings');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data')
            ->assertJsonPath('data.0.user_id', $user->id);
    }

    public function test_admin_can_view_all_bookings()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Booking::factory()->count(5)->create();

        $response = $this->actingAs($admin)
            ->getJson('/api/bookings');

        $response->assertStatus(200)
            ->assertJsonCount(5, 'data');
    }

    public function test_employee_can_view_all_bookings()
    {
        $employee = User::factory()->create(['role' => 'employee']);
        Booking::factory()->count(5)->create();

        $response = $this->actingAs($employee)
            ->getJson('/api/bookings');

        $response->assertStatus(200)
            ->assertJsonCount(5, 'data');
    }

    public function test_admin_can_filter_bookings_by_user_email()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['email' => 'user@example.com']);

        Booking::factory()->count(3)->create(['user_id' => $user->id]);
        Booking::factory()->count(2)->create();

        $response = $this->actingAs($admin)
            ->getJson('/api/bookings?search=user@example.com');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_user_can_filter_bookings_by_date()
    {
        $user = User::factory()->create(['role' => 'user']);

        // Create bookings with different dates
        Booking::factory()->create([
            'user_id' => $user->id,
            'check_in_date' => '2024-04-15',
            'check_out_date' => '2024-04-20'
        ]);
        Booking::factory()->create([
            'user_id' => $user->id,
            'check_in_date' => '2024-05-01',
            'check_out_date' => '2024-05-05'
        ]);

        $response = $this->actingAs($user)
            ->getJson('/api/bookings?from_date=2024-04-01&to_date=2024-04-30');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    // Creating Bookings Tests
    public function test_user_can_create_booking()
    {
        $user = User::factory()->create(['role' => 'user']);
        $hotel = Hotel::factory()->create(['is_available' => true]);

        $bookingData = [
            'hotel_id' => $hotel->id,
            'check_in_date' => Carbon::tomorrow()->format('Y-m-d'),
            'check_out_date' => Carbon::tomorrow()->addDays(5)->format('Y-m-d'),
            'guest_names' => ['John Doe', 'Jane Doe'],
            'special_requests' => 'Early check-in requested',
            'contact_phone' => '+1234567890'
        ];

        $response = $this->actingAs($user)
            ->postJson('/api/bookings', $bookingData);

        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Booking created successfully'
            ]);
    }

    public function test_cannot_create_booking_with_invalid_dates()
    {
        $user = User::factory()->create(['role' => 'user']);
        $hotel = Hotel::factory()->create(['is_available' => true]);

        $bookingData = [
            'hotel_id' => $hotel->id,
            'check_in_date' => '2024-04-20',
            'check_out_date' => '2024-04-15', // Check-out before check-in
            'guest_names' => ['John Doe']
        ];

        $response = $this->actingAs($user)
            ->postJson('/api/bookings', $bookingData);

        $response->assertStatus(422);
    }

    public function test_cannot_create_booking_with_too_many_guests()
    {
        $user = User::factory()->create(['role' => 'user']);
        $hotel = Hotel::factory()->create([
            'is_available' => true,
            'available_rooms' => 1 // Only one room available
        ]);

        $bookingData = [
            'hotel_id' => $hotel->id,
            'check_in_date' => '2024-04-15',
            'check_out_date' => '2024-04-20',
            'guest_names' => array_fill(0, 10, 'Guest Name'), // Too many guests
            'contact_phone' => '+1234567890'
        ];

        $response = $this->actingAs($user)
            ->postJson('/api/bookings', $bookingData);

        $response->assertStatus(422);
    }

    // Viewing Booking Details Tests
    public function test_user_can_view_own_booking_details()
    {
        $user = User::factory()->create(['role' => 'user']);
        $booking = Booking::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->getJson("/api/bookings/{$booking->id}");

        $response->assertStatus(200)
            ->assertJson([
                'id' => $booking->id,
                'user_id' => $user->id
            ]);
    }

    public function test_admin_can_view_any_booking_details()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $booking = Booking::factory()->create();

        $response = $this->actingAs($admin)
            ->getJson("/api/bookings/{$booking->id}");

        $response->assertStatus(200)
            ->assertJson([
                'id' => $booking->id
            ]);
    }

    public function test_user_cannot_view_others_booking_details()
    {
        $user = User::factory()->create(['role' => 'user']);
        $otherUser = User::factory()->create(['role' => 'user']);
        $booking = Booking::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)
            ->getJson("/api/bookings/{$booking->id}");

        $response->assertStatus(403);
    }

    // Updating Bookings Tests
    public function test_user_can_update_own_booking()
    {
        $user = User::factory()->create(['role' => 'user']);
        $booking = Booking::factory()->create(['user_id' => $user->id]);

        $updateData = [
            'special_requests' => 'Updated special requests'
        ];

        $response = $this->actingAs($user)
            ->putJson("/api/bookings/{$booking->id}", $updateData);

        $response->assertStatus(200)
            ->assertJsonPath('data.special_requests', 'Updated special requests');
    }

    public function test_admin_can_update_any_booking()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $booking = Booking::factory()->create();

        $updateData = [
            'status' => 'confirmed'
        ];

        $response = $this->actingAs($admin)
            ->putJson("/api/bookings/{$booking->id}", $updateData);

        $response->assertStatus(200)
            ->assertJsonPath('data.status', 'confirmed');
    }

    public function test_user_cannot_update_others_booking()
    {
        $user = User::factory()->create(['role' => 'user']);
        $otherUser = User::factory()->create(['role' => 'user']);
        $booking = Booking::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)
            ->putJson("/api/bookings/{$booking->id}", [
                'special_requests' => 'Updated special requests'
            ]);

        $response->assertStatus(403);
    }

    // Cancelling Bookings Tests
    public function test_user_can_cancel_booking_before_48_hours()
    {
        $user = User::factory()->create(['role' => 'user']);
        $booking = Booking::factory()->create([
            'user_id' => $user->id,
            'check_in_date' => Carbon::now()->addDays(5)
        ]);

        $response = $this->actingAs($user)
            ->deleteJson("/api/bookings/{$booking->id}");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Booking cancelled successfully'
            ]);
    }

    public function test_user_cannot_cancel_booking_within_48_hours()
    {
        $user = User::factory()->create(['role' => 'user']);
        $booking = Booking::factory()->create([
            'user_id' => $user->id,
            'check_in_date' => Carbon::now()->addHours(47)
        ]);

        $response = $this->actingAs($user)
            ->deleteJson("/api/bookings/{$booking->id}");

        $response->assertStatus(400)
            ->assertJson([
                'message' => 'Bookings can only be cancelled at least 2 days before check-in'
            ]);
    }

    public function test_admin_can_cancel_any_booking_anytime()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $booking = Booking::factory()->create([
            'check_in_date' => Carbon::now()->addHours(1)
        ]);

        $response = $this->actingAs($admin)
            ->deleteJson("/api/bookings/{$booking->id}");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Booking cancelled successfully'
            ]);
    }

    public function test_user_cannot_cancel_others_booking()
    {
        $user = User::factory()->create(['role' => 'user']);
        $otherUser = User::factory()->create(['role' => 'user']);
        $booking = Booking::factory()->create([
            'user_id' => $otherUser->id,
            'check_in_date' => Carbon::now()->addDays(5)
        ]);

        $response = $this->actingAs($user)
            ->deleteJson("/api/bookings/{$booking->id}");

        $response->assertStatus(403);
    }

    // Booking Search Tests
    public function test_admin_can_search_bookings_by_user_email()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['email' => 'saad@example.com']);

        // Create bookings for the target user
        Booking::factory()->count(3)->create(['user_id' => $user->id]);
        // Create other bookings
        Booking::factory()->count(2)->create();

        $response = $this->actingAs($admin)
            ->getJson('/api/bookings?search=saad@example.com');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data')
            ->assertJsonPath('data.0.user_id', $user->id);
    }

    public function test_admin_can_search_bookings_by_hotel_name()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $hotel = Hotel::factory()->create(['name' => 'Luxury Beach Resort']);

        // Create bookings for the target hotel
        Booking::factory()->count(2)->create(['hotel_id' => $hotel->id]);
        // Create other bookings
        Booking::factory()->count(3)->create();

        $response = $this->actingAs($admin)
            ->getJson('/api/bookings?search=Luxury Beach Resort');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.hotel_id', $hotel->id);
    }

    public function test_admin_can_filter_bookings_by_date_range()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        // Create bookings in May
        Booking::factory()->count(2)->create([
            'check_in_date' => '2024-05-15',
            'check_out_date' => '2024-05-20'
        ]);
        // Create bookings outside May
        Booking::factory()->create([
            'check_in_date' => '2024-04-15',
            'check_out_date' => '2024-04-20'
        ]);

        $response = $this->actingAs($admin)
            ->getJson('/api/bookings?from_date=2024-05-01&to_date=2024-05-31');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    public function test_admin_can_filter_bookings_by_status()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        // Create cancelled bookings
        Booking::factory()->count(2)->create(['status' => 'cancelled']);
        // Create other bookings
        Booking::factory()->create(['status' => 'confirmed']);
        Booking::factory()->create(['status' => 'pending']);

        $response = $this->actingAs($admin)
            ->getJson('/api/bookings?status=cancelled');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.status', 'cancelled')
            ->assertJsonPath('data.1.status', 'cancelled');
    }

    public function test_admin_can_combine_search_and_filters()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['name' => 'Saad Ahmed']);

        // Create matching bookings
        Booking::factory()->create([
            'user_id' => $user->id,
            'status' => 'confirmed',
            'check_in_date' => '2024-04-15',
            'check_out_date' => '2024-04-20'
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

        $response = $this->actingAs($admin)
            ->getJson('/api/bookings?search=Saad&status=confirmed&from_date=2024-04-01&to_date=2024-04-30');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.status', 'confirmed')
            ->assertJsonPath('data.0.user_id', $user->id);
    }
}
