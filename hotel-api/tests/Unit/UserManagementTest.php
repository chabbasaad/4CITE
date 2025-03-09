<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    // Role Management Tests
    public function test_user_has_correct_default_role()
    {
        $user = User::factory()->create();
        $this->assertEquals('user', $user->role);
    }

    public function test_user_role_checking_methods()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $employee = User::factory()->create(['role' => 'employee']);
        $user = User::factory()->create(['role' => 'user']);

        $this->assertTrue($admin->isAdmin());
        $this->assertFalse($employee->isAdmin());
        $this->assertFalse($user->isAdmin());

        $this->assertTrue($employee->isEmployee());
        $this->assertFalse($admin->isEmployee());
        $this->assertFalse($user->isEmployee());
    }

    public function test_role_case_sensitivity()
    {
        // Create a user with lowercase role
        $user = User::factory()->create(['role' => 'user']);

        // Test that role comparison is case sensitive
        $this->assertFalse($user->role === 'User');
        $this->assertTrue($user->role === 'user');

        // Test the isAdmin method
        $admin = User::factory()->create(['role' => 'admin']);
        $this->assertTrue($admin->isAdmin());
        $this->assertFalse($admin->role === 'Admin');
    }

    // User Creation Tests
    public function test_user_creation_with_valid_data()
    {
        $userData = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'pseudo' => 'testuser',
            'role' => 'user',
        ];

        $user = User::create($userData);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals($userData['name'], $user->name);
        $this->assertEquals($userData['email'], $user->email);
        $this->assertEquals($userData['pseudo'], $user->pseudo);
        $this->assertEquals($userData['role'], $user->role);
    }

    public function test_email_is_unique()
    {
        User::factory()->create(['email' => 'test@example.com']);

        $this->expectException(\Illuminate\Database\QueryException::class);

        User::factory()->create(['email' => 'test@example.com']);
    }

    public function test_pseudo_is_unique()
    {
        User::factory()->create(['pseudo' => 'testuser']);

        $this->expectException(\Illuminate\Database\QueryException::class);

        User::factory()->create(['pseudo' => 'testuser']);
    }

    // Email Handling Tests
    public function test_email_case_insensitive_comparison()
    {
        $user1 = User::factory()->create(['email' => 'test@example.com']);

        $this->expectException(\Illuminate\Database\QueryException::class);

        User::factory()->create(['email' => 'TEST@example.com']);
    }

    public function test_email_is_stored_in_lowercase()
    {
        $user = User::factory()->create(['email' => 'TEST@EXAMPLE.COM']);
        $this->assertEquals('test@example.com', $user->email);
    }

    // Password Management Tests
    public function test_password_is_hashed()
    {
        $password = 'password123';
        $user = User::factory()->create(['password' => $password]);

        $this->assertNotEquals($password, $user->password);
        $this->assertTrue(Hash::check($password, $user->password));
    }

    // User Search and Filter Tests
    public function test_search_users_by_name()
    {
        User::factory()->create(['name' => 'John Doe']);
        User::factory()->create(['name' => 'Jane Smith']);
        User::factory()->create(['name' => 'John Smith']);

        $results = User::where('name', 'like', '%John%')->get();
        $this->assertEquals(2, $results->count());
    }

    public function test_filter_users_by_role()
    {
        User::factory()->create(['role' => 'admin']);
        User::factory()->create(['role' => 'employee']);
        User::factory()->create(['role' => 'user']);
        User::factory()->create(['role' => 'user']);

        $admins = User::where('role', 'admin')->get();
        $users = User::where('role', 'user')->get();

        $this->assertEquals(1, $admins->count());
        $this->assertEquals(2, $users->count());
    }

    // User Update Tests
    public function test_update_user_profile()
    {
        $user = User::factory()->create();

        $user->update([
            'name' => 'Updated Name',
            'pseudo' => 'updatedpseudo',
        ]);

        $this->assertEquals('Updated Name', $user->fresh()->name);
        $this->assertEquals('updatedpseudo', $user->fresh()->pseudo);
    }

    public function test_update_email_maintains_uniqueness()
    {
        $user1 = User::factory()->create(['email' => 'user1@example.com']);
        $user2 = User::factory()->create(['email' => 'user2@example.com']);

        $this->expectException(\Illuminate\Database\QueryException::class);

        $user2->update(['email' => 'user1@example.com']);
    }

    // User Deletion Tests
    public function test_soft_delete_functionality()
    {
        $user = User::factory()->create();
        $userId = $user->id;

        $user->delete();

        $this->assertSoftDeleted('users', ['id' => $userId]);
    }

    public function test_cascade_delete_related_data()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $user->delete();

        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
        ]);
    }
}
