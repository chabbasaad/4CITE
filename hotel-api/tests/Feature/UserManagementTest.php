<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    // User Listing Tests
    public function test_admin_can_view_all_users()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $users = User::factory()->count(3)->create();

        $response = $this->actingAs($admin)
            ->getJson('/api/users');

        $response->assertStatus(200)
            ->assertJsonCount(4, 'data');
    }

    public function test_employee_can_view_all_users()
    {
        $employee = User::factory()->create(['role' => 'employee']);
        $users = User::factory()->count(3)->create();

        $response = $this->actingAs($employee)
            ->getJson('/api/users');

        $response->assertStatus(200)
            ->assertJsonCount(4, 'data');
    }

    public function test_regular_user_cannot_view_all_users()
    {
        $user = User::factory()->create(['role' => 'user']);
        User::factory()->count(3)->create();

        $response = $this->actingAs($user)
            ->getJson('/api/users');

        $response->assertStatus(403);
    }

    // User Creation Tests
    public function test_admin_can_create_admin_user()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $newUserData = [
            'name' => 'New Admin',
            'email' => 'newadmin@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'pseudo' => 'newadmin',
            'role' => 'admin',
        ];

        $response = $this->actingAs($admin)
            ->postJson('/api/users', $newUserData);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'role' => 'admin',
                    'email' => 'newadmin@example.com',
                ],
            ]);
    }

    public function test_admin_can_create_employee_user()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $newUserData = [
            'name' => 'New Employee',
            'email' => 'employee@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'pseudo' => 'newemployee',
            'role' => 'employee',
        ];

        $response = $this->actingAs($admin)
            ->postJson('/api/users', $newUserData);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'role' => 'employee',
                ],
            ]);
    }

    public function test_employee_can_only_create_regular_user()
    {
        $employee = User::factory()->create(['role' => 'employee']);
        $newUserData = [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'pseudo' => 'newuser',
            'role' => 'user', // Creating with correct role
        ];

        $response = $this->actingAs($employee)
            ->postJson('/api/users', $newUserData);

        $response->assertStatus(201);
        $this->assertEquals('user', User::where('email', 'newuser@example.com')->first()->role);

        // Try to create admin user (should fail)
        $newUserData['email'] = 'newadmin@example.com';
        $newUserData['pseudo'] = 'newadmin';
        $newUserData['role'] = 'admin';

        $response = $this->actingAs($employee)
            ->postJson('/api/users', $newUserData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('role');
    }

    // User Profile Viewing Tests
    public function test_user_can_view_own_profile()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->getJson("/api/users/{$user->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $user->id,
                    'email' => $user->email,
                ],
            ]);
    }

    public function test_admin_can_view_other_user_profile()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create();

        $response = $this->actingAs($admin)
            ->getJson("/api/users/{$user->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $user->id,
                ],
            ]);
    }

    public function test_regular_user_cannot_view_other_profile()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $response = $this->actingAs($user1)
            ->getJson("/api/users/{$user2->id}");

        $response->assertStatus(403);
    }

    // User Update Tests
    public function test_user_can_update_own_profile()
    {
        $user = User::factory()->create();
        $updateData = [
            'name' => 'Updated Name',
            'pseudo' => 'updatedpseudo',
        ];

        $response = $this->actingAs($user)
            ->putJson("/api/users/{$user->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'name' => 'Updated Name',
                    'pseudo' => 'updatedpseudo',
                ],
            ]);
    }

    public function test_admin_can_update_user_role()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($admin)
            ->putJson("/api/users/{$user->id}", [
                'role' => 'employee',
            ]);

        $response->assertStatus(200);
        $this->assertEquals('employee', $user->fresh()->role);
    }

    public function test_regular_user_cannot_update_role()
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)
            ->putJson("/api/users/{$user->id}", [
                'role' => 'admin',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('role')
            ->assertJson([
                'message' => 'You are not authorized to change roles.',
            ]);

        $this->assertEquals('user', $user->fresh()->role);
    }

    // User Deletion Tests
    public function test_user_can_delete_own_account()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->deleteJson("/api/users/{$user->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('users', ['id' => $user->id]);
    }

    public function test_admin_can_delete_other_user()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create();

        $response = $this->actingAs($admin)
            ->deleteJson("/api/users/{$user->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('users', ['id' => $user->id]);
    }

    public function test_cannot_delete_last_admin()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)
            ->deleteJson("/api/users/{$admin->id}");

        $response->assertStatus(400)
            ->assertJson([
                'message' => 'Cannot delete the last admin user',
            ]);
        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }

    public function test_employee_cannot_delete_other_user()
    {
        $employee = User::factory()->create(['role' => 'employee']);
        $user = User::factory()->create();

        $response = $this->actingAs($employee)
            ->deleteJson("/api/users/{$user->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('users', ['id' => $user->id]);
    }
}
