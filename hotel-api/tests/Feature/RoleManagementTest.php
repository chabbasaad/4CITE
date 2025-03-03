<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Hotel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleManagementTest extends TestCase
{
    use RefreshDatabase;

    // User Management Access Tests
    public function test_admin_can_access_user_management()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)
            ->getJson('/api/users');

        $response->assertStatus(200);
    }

    public function test_employee_can_access_user_management()
    {
        $employee = User::factory()->create(['role' => 'employee']);

        $response = $this->actingAs($employee)
            ->getJson('/api/users');

        $response->assertStatus(200);
    }

    public function test_regular_user_cannot_access_user_management()
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)
            ->getJson('/api/users');

        $response->assertStatus(403)
            ->assertJson(['message' => 'Unauthorized. Only admins and employees can list users.']);
    }

    // Hotel Management Tests
    public function test_admin_can_create_hotel()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $hotelData = [
            'name' => 'Test Hotel',
            'location' => 'Test Location',
            'description' => 'Test Description',
            'price_per_night' => 100,
            'total_rooms' => 20,
            'available_rooms' => 15,
            'is_available' => true,
            'amenities' => ['WiFi', 'Pool'],
            'picture_list' => ['http://example.com/image1.jpg']
        ];

        $response = $this->actingAs($admin)
            ->postJson('/api/hotels', $hotelData);

        $response->assertStatus(201)
            ->assertJson(['message' => 'Hotel created successfully']);
    }

    public function test_employee_cannot_create_hotel()
    {
        $employee = User::factory()->create(['role' => 'employee']);
        $hotelData = [
            'name' => 'New Test Hotel',
            'location' => 'Test Location',
            'description' => 'Test Description',
            'price_per_night' => 100,
            'available_rooms' => 10,
            'is_available' => true
        ];

        $response = $this->actingAs($employee)
            ->postJson('/api/hotels', $hotelData);

        $response->assertStatus(403)
            ->assertJson(['message' => 'This action is unauthorized.']);
    }

    public function test_admin_can_update_hotel()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $hotel = Hotel::factory()->create();
        $updateData = [
            'name' => 'Updated Hotel Name',
            'price_per_night' => 150
        ];

        $response = $this->actingAs($admin)
            ->putJson("/api/hotels/{$hotel->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Hotel updated successfully']);
    }

    public function test_employee_cannot_update_hotel()
    {
        $employee = User::factory()->create(['role' => 'employee']);
        $hotel = Hotel::factory()->create();
        $updateData = [
            'name' => 'Updated Hotel Name'
        ];

        $response = $this->actingAs($employee)
            ->putJson("/api/hotels/{$hotel->id}", $updateData);

        $response->assertStatus(403)
            ->assertJson(['message' => 'This action is unauthorized.']);
    }

    // User Profile Access Tests
    public function test_user_can_view_own_profile()
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)
            ->getJson("/api/users/{$user->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $user->id,
                    'email' => $user->email
                ]
            ]);
    }

    public function test_user_cannot_view_other_user_profile()
    {
        $user = User::factory()->create(['role' => 'user']);
        $otherUser = User::factory()->create();

        $response = $this->actingAs($user)
            ->getJson("/api/users/{$otherUser->id}");

        $response->assertStatus(403)
            ->assertJson(['message' => 'Unauthorized. You can only view your own profile.']);
    }

    public function test_admin_can_view_any_user_profile()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create();

        $response = $this->actingAs($admin)
            ->getJson("/api/users/{$user->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $user->id,
                    'email' => $user->email
                ]
            ]);
    }

    public function test_employee_can_view_any_user_profile()
    {
        $employee = User::factory()->create(['role' => 'employee']);
        $user = User::factory()->create();

        $response = $this->actingAs($employee)
            ->getJson("/api/users/{$user->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $user->id,
                    'email' => $user->email
                ]
            ]);
    }
}
