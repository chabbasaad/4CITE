<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Hotel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HotelManagementTest extends TestCase
{
    use RefreshDatabase;

    // Hotel Listing Tests
    public function test_visitor_can_view_all_hotels()
    {
        $hotels = Hotel::factory()->count(3)->create();

        $response = $this->getJson('/api/hotels');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_user_can_filter_hotels_by_location()
    {
        Hotel::factory()->create(['location' => 'Beach City']);
        Hotel::factory()->create(['location' => 'Mountain Town']);
        Hotel::factory()->create(['location' => 'Beach City']);

        $response = $this->getJson('/api/hotels?search=Beach City');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.location', 'Beach City')
            ->assertJsonPath('data.1.location', 'Beach City');
    }

    public function test_user_can_sort_hotels_by_price()
    {
        Hotel::factory()->create(['price_per_night' => 200]);
        Hotel::factory()->create(['price_per_night' => 100]);
        Hotel::factory()->create(['price_per_night' => 300]);

        $response = $this->getJson('/api/hotels?sort_by=price_per_night&direction=asc');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');

        $prices = collect($response->json('data'))->pluck('price_per_night')->toArray();
        $this->assertEquals([100, 200, 300], $prices);
    }

    public function test_employee_can_view_hotels_with_booking_info()
    {
        $employee = User::factory()->create(['role' => 'employee']);
        $hotel = Hotel::factory()->create();
        $booking = Booking::factory()->create(['hotel_id' => $hotel->id]);

        $response = $this->actingAs($employee)
            ->getJson('/api/hotels');

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    [
                        'id' => $hotel->id,
                        'bookings' => [
                            [
                                'id' => $booking->id,
                            ],
                        ],
                    ],
                ],
            ]);
    }

    // Hotel Details Tests
    public function test_visitor_can_view_hotel_details()
    {
        $hotel = Hotel::factory()->create();

        $response = $this->getJson("/api/hotels/{$hotel->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $hotel->id,
                    'name' => $hotel->name,
                ],
            ]);
    }

    public function test_employee_can_view_hotel_details_with_bookings()
    {
        $employee = User::factory()->create(['role' => 'employee']);
        $hotel = Hotel::factory()->create();
        $booking = Booking::factory()->create(['hotel_id' => $hotel->id]);

        $response = $this->actingAs($employee)
            ->getJson("/api/hotels/{$hotel->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $hotel->id,
                    'bookings' => [
                        [
                            'id' => $booking->id,
                        ],
                    ],
                ],
            ]);
    }

    public function test_viewing_nonexistent_hotel()
    {
        $response = $this->getJson('/api/hotels/999');
        $response->assertStatus(404);
    }

    // Hotel Creation Tests
    public function test_admin_can_create_hotel()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $hotelData = [
            'name' => 'New Hotel',
            'location' => 'Test Location',
            'description' => 'Test Description',
            'price_per_night' => 100,
            'is_available' => true,
            'total_rooms' => 20,
            'available_rooms' => 10,
            'amenities' => ['WiFi', 'Pool', 'Gym'],
            'picture_list' => ['http://example.com/image1.jpg'],
        ];

        $response = $this->actingAs($admin)
            ->postJson('/api/hotels', $hotelData);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'name' => 'New Hotel',
                    'location' => 'Test Location',
                    'total_rooms' => 20,
                    'available_rooms' => 10,
                ],
            ]);
    }

    public function test_employee_cannot_create_hotel()
    {
        $employee = User::factory()->create(['role' => 'employee']);
        $hotelData = [
            'name' => 'New Hotel',
            'location' => 'Test Location',
            'description' => 'Test Description',
            'price_per_night' => 100,
            'is_available' => true,
            'total_rooms' => 20,
            'available_rooms' => 10,
            'amenities' => ['WiFi', 'Pool', 'Gym'],
            'picture_list' => ['http://example.com/image1.jpg'],
        ];

        $response = $this->actingAs($employee)
            ->postJson('/api/hotels', $hotelData);

        $response->assertStatus(403);
        $this->assertDatabaseMissing('hotels', ['name' => 'New Hotel']);
    }

    public function test_admin_cannot_create_hotel_with_invalid_data()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $hotelData = [
            'name' => '',
            'price_per_night' => -10,
            'total_rooms' => 0,
            'available_rooms' => 50,
        ];

        $response = $this->actingAs($admin)
            ->postJson('/api/hotels', $hotelData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'price_per_night', 'total_rooms', 'available_rooms']);
    }

    // Hotel Update Tests
    public function test_admin_can_update_hotel()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $hotel = Hotel::factory()->create();
        $updateData = [
            'name' => 'Updated Hotel',
            'price_per_night' => 150,
            'total_rooms' => 30,
            'available_rooms' => 25,
            'amenities' => ['WiFi', 'Pool', 'Spa'],
        ];

        $response = $this->actingAs($admin)
            ->putJson("/api/hotels/{$hotel->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'name' => 'Updated Hotel',
                    'price_per_night' => 150,
                    'total_rooms' => 30,
                    'available_rooms' => 25,
                ],
            ]);
    }

    public function test_employee_cannot_update_hotel()
    {
        $employee = User::factory()->create(['role' => 'employee']);
        $hotel = Hotel::factory()->create(['name' => 'Original Name']);

        $response = $this->actingAs($employee)
            ->putJson("/api/hotels/{$hotel->id}", [
                'name' => 'Updated Name',
            ]);

        $response->assertStatus(403);
        $this->assertEquals('Original Name', $hotel->fresh()->name);
    }

    public function test_updating_nonexistent_hotel()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)
            ->putJson('/api/hotels/999', [
                'name' => 'Updated Name',
            ]);

        $response->assertStatus(404);
    }

    // Hotel Deletion Tests
    public function test_admin_can_delete_hotel_without_bookings()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $hotel = Hotel::factory()->create();

        $response = $this->actingAs($admin)
            ->deleteJson("/api/hotels/{$hotel->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('hotels', ['id' => $hotel->id]);
    }

    public function test_admin_cannot_delete_hotel_with_bookings()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $hotel = Hotel::factory()->create();
        Booking::factory()->create(['hotel_id' => $hotel->id]);

        $response = $this->actingAs($admin)
            ->deleteJson("/api/hotels/{$hotel->id}");

        $response->assertStatus(409)
            ->assertJson([
                'message' => 'Cannot delete hotel with existing bookings',
            ]);
        $this->assertDatabaseHas('hotels', ['id' => $hotel->id]);
    }

    public function test_employee_cannot_delete_hotel()
    {
        $employee = User::factory()->create(['role' => 'employee']);
        $hotel = Hotel::factory()->create();

        $response = $this->actingAs($employee)
            ->deleteJson("/api/hotels/{$hotel->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('hotels', ['id' => $hotel->id]);
    }

    // Search and Filter Tests
    public function test_user_can_search_hotels_by_name()
    {
        Hotel::factory()->create(['name' => 'Luxury Beach Resort']);
        Hotel::factory()->create(['name' => 'Mountain Lodge']);
        Hotel::factory()->create(['name' => 'Luxury Hotel']);

        $response = $this->getJson('/api/hotels?search=Luxury');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.name', fn ($name) => in_array($name, ['Luxury Beach Resort', 'Luxury Hotel']))
            ->assertJsonPath('data.1.name', fn ($name) => in_array($name, ['Luxury Beach Resort', 'Luxury Hotel']));
    }

    public function test_user_can_filter_hotels_by_price_range()
    {
        Hotel::factory()->create(['name' => 'Budget Hotel', 'price_per_night' => 50]);
        Hotel::factory()->create(['name' => 'Comfort Hotel', 'price_per_night' => 150]);
        Hotel::factory()->create(['name' => 'Luxury Hotel', 'price_per_night' => 350]);

        $response = $this->getJson('/api/hotels?min_price=100&max_price=300');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Comfort Hotel');
    }

    public function test_user_can_filter_hotels_by_availability()
    {
        Hotel::factory()->create(['name' => 'Available Hotel', 'is_available' => true, 'available_rooms' => 5]);
        Hotel::factory()->create(['name' => 'Unavailable Hotel', 'is_available' => false, 'available_rooms' => 0]);
        Hotel::factory()->create(['name' => 'Another Available', 'is_available' => true, 'available_rooms' => 3]);

        $response = $this->getJson('/api/hotels?available=1');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.is_available', true)
            ->assertJsonPath('data.1.is_available', true);
    }

    public function test_user_can_combine_search_and_filters()
    {
        Hotel::factory()->create([
            'name' => 'Beach Resort',
            'price_per_night' => 250,
            'is_available' => true,
            'available_rooms' => 5,
        ]);
        Hotel::factory()->create([
            'name' => 'Beach Hotel',
            'price_per_night' => 150,
            'is_available' => false,
            'available_rooms' => 0,
        ]);
        Hotel::factory()->create([
            'name' => 'Beach Palace',
            'price_per_night' => 450,
            'is_available' => true,
            'available_rooms' => 3,
        ]);

        $response = $this->getJson('/api/hotels?search=Beach&min_price=200&max_price=400&available=1');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Beach Resort');
    }

    public function test_search_includes_description()
    {
        Hotel::factory()->create([
            'name' => 'Mountain Hotel',
            'description' => 'A luxury experience in the mountains',
        ]);
        Hotel::factory()->create([
            'name' => 'City Hotel',
            'description' => 'Standard accommodation',
        ]);

        $response = $this->getJson('/api/hotels?search=luxury');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Mountain Hotel');
    }

    public function test_invalid_price_range_returns_validation_error()
    {
        $response = $this->getJson('/api/hotels?min_price=300&max_price=100');

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['max_price']);
    }

    public function test_negative_price_returns_validation_error()
    {
        $response = $this->getJson('/api/hotels?min_price=-100');

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['min_price']);
    }
}
