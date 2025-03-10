<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Str;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    private $testUser;
    private $testAdmin;
    private $testEmployee;
    private $defaultPassword;

    protected function setUp(): void
    {
        parent::setUp();

        $this->defaultPassword = 'password123';

        // Create test users with different roles
        $this->testUser = User::factory()->create([
            'email' => 'testuser@example.com',
            'password' => bcrypt($this->defaultPassword),
            'role' => 'user'
        ]);

        $this->testAdmin = User::factory()->create([
            'email' => 'testadmin@example.com',
            'password' => bcrypt($this->defaultPassword),
            'role' => 'admin'
        ]);

        $this->testEmployee = User::factory()->create([
            'email' => 'testemployee@example.com',
            'password' => bcrypt($this->defaultPassword),
            'role' => 'employee'
        ]);
    }

    protected function tearDown(): void
    {
        // Clean up test data
        $this->testUser = null;
        $this->testAdmin = null;
        $this->testEmployee = null;
        $this->defaultPassword = null;

        parent::tearDown();
    }

    public function test_successful_login()
    {
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => bcrypt('password123'),
            'role' => 'user'
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'user@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'user',
                'token'
            ]);
    }

    public function test_failed_login_with_incorrect_password()
    {
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => bcrypt('password123'),
            'role' => 'user'
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'user@example.com',
            'password' => 'wrongpassword'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_failed_login_with_nonexistent_email()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'nonexistent@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_login_with_trimmed_email()
    {
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => bcrypt('password123'),
            'role' => 'user'
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => '  user@example.com  ',
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'user',
                'token'
            ]);
    }

    public function test_login_with_incorrect_email_format()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'invalid-email-format',
            'password' => 'password123'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_login_with_case_insensitive_email()
    {
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => bcrypt('password123'),
            'role' => 'user'
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'USER@EXAMPLE.COM',
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'user',
                'token'
            ]);
    }

    public function test_login_with_case_sensitive_password()
    {
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => bcrypt('Password123'),
            'role' => 'user'
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'user@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }


    public function test_login_with_very_long_password()
    {
        $longPassword = Str::random(100);
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => bcrypt($longPassword),
            'role' => 'user'
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'user@example.com',
            'password' => $longPassword
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'user',
                'token'
            ]);
    }

    public function test_login_with_blank_email()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => '',
            'password' => 'password123'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_login_with_blank_password()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'user@example.com',
            'password' => ''
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_login_with_missing_fields()
    {
        $response = $this->postJson('/api/auth/login', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_login_maintains_session()
    {
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => bcrypt('password123'),
            'role' => 'user'
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'user@example.com',
            'password' => 'password123'
        ]);

        $token = $response->json('token');

        // Try to access protected route
        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/auth/user')
            ->assertStatus(200)
            ->assertJson($user->toArray());
    }
}
