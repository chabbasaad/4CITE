<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleManagementTest extends TestCase
{
    use RefreshDatabase;

    // Role Assignment Tests
    public function test_user_has_default_role()
    {
        $user = User::factory()->create();
        $this->assertEquals('user', $user->role);
    }

    public function test_user_can_be_assigned_admin_role()
    {
        $user = User::factory()->create(['role' => 'admin']);
        $this->assertEquals('admin', $user->role);
    }

    public function test_user_can_be_assigned_employee_role()
    {
        $user = User::factory()->create(['role' => 'employee']);
        $this->assertEquals('employee', $user->role);
    }

    // Role Check Methods Tests
    public function test_is_admin_method()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'user']);

        $this->assertTrue($admin->isAdmin());
        $this->assertFalse($user->isAdmin());
    }

    public function test_is_employee_method()
    {
        $employee = User::factory()->create(['role' => 'employee']);
        $user = User::factory()->create(['role' => 'user']);

        $this->assertTrue($employee->isEmployee());
        $this->assertFalse($user->isEmployee());
    }

    public function test_is_staff_method()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $employee = User::factory()->create(['role' => 'employee']);
        $user = User::factory()->create(['role' => 'user']);

        $this->assertTrue($admin->isStaff());
        $this->assertTrue($employee->isStaff());
        $this->assertFalse($user->isStaff());
    }

    // Role Validation Tests
    public function test_role_must_be_valid()
    {
        $this->expectException(\Illuminate\Database\QueryException::class);
        User::factory()->create(['role' => 'invalid_role']);
    }

    public function test_role_is_case_sensitive()
    {
        $this->expectException(\Illuminate\Database\QueryException::class);
        User::factory()->create(['role' => 'ADMIN']);
    }

    // Permission Check Tests
    public function test_admin_has_all_permissions()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        // User management permissions
        $this->assertTrue($admin->isAdmin());
        $this->assertTrue($admin->isStaff());
        $this->assertTrue($admin->can('manage_users'));
        $this->assertTrue($admin->can('manage_hotels'));

        // Hotel management permissions
        $this->assertTrue($admin->can('create_hotel'));
        $this->assertTrue($admin->can('update_hotel'));
        $this->assertTrue($admin->can('delete_hotel'));

        // Profile and booking permissions
        $this->assertTrue($admin->can('view_any_profile'));
        $this->assertTrue($admin->can('view_all_bookings'));
    }

    public function test_employee_has_limited_permissions()
    {
        $employee = User::factory()->create(['role' => 'employee']);

        // User management permissions
        $this->assertFalse($employee->isAdmin());
        $this->assertTrue($employee->isStaff());
        $this->assertTrue($employee->can('view_users'));
        $this->assertFalse($employee->can('manage_hotels'));

        // Hotel management permissions
        $this->assertFalse($employee->can('create_hotel'));
        $this->assertFalse($employee->can('update_hotel'));
        $this->assertFalse($employee->can('delete_hotel'));

        // Profile and booking permissions
        $this->assertTrue($employee->can('view_any_profile'));
        $this->assertTrue($employee->can('view_all_bookings'));
    }

    public function test_user_has_basic_permissions()
    {
        $user = User::factory()->create(['role' => 'user']);

        // Basic permissions
        $this->assertFalse($user->isAdmin());
        $this->assertFalse($user->isStaff());
        $this->assertFalse($user->can('manage_users'));
        $this->assertFalse($user->can('manage_hotels'));

        // Profile and booking permissions
        $this->assertTrue($user->can('view_profile'));
        $this->assertTrue($user->can('create_booking'));
        $this->assertTrue($user->can('view_own_bookings'));
    }
}
