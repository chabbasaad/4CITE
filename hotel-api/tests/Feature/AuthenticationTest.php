<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_successful_registration()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Saad chabba',
            'email' => 'saad.chabba@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'pseudo' => 'Saadchabba',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'user',
                'token',
            ]);

        $this->assertDatabaseHas('users', [
            'name' => 'Saad chabba',
            'email' => 'saad.chabba@example.com',
            'pseudo' => 'Saadchabba',
        ]);
    }

    public function test_registration_with_existing_email()
    {
        // Create a user first
        User::factory()->create([
            'email' => 'existing@example.com',
        ]);

        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'existing@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'pseudo' => 'testuser',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_registration_with_invalid_data()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => '',
            'email' => 'invalid-email',
            'password' => 'short',
            'pseudo' => '',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'password', 'pseudo']);
    }

    public function test_registration_with_weak_password()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'weak',
            'password_confirmation' => 'weak',
            'pseudo' => 'testuser',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_registration_with_trimmed_email()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => '  test@example.com  ',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'pseudo' => 'testuser',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
        ]);
    }

    public function test_registration_with_duplicate_pseudo()
    {
        // Create a user first
        User::factory()->create([
            'pseudo' => 'existingpseudo',
        ]);

        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'pseudo' => 'existingpseudo',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['pseudo']);
    }

    public function test_successful_login()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('Password123!'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'user',
                'token',
            ]);
    }

    public function test_login_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('Password123!'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_successful_logout()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer '.$token,
        ])->postJson('/api/auth/logout');

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Successfully logged out',
            ]);

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_get_authenticated_user()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer '.$token,
        ])->getJson('/api/auth/user');

        $response->assertStatus(200)
            ->assertJson($user->toArray());
    }

    public function test_login_with_nonexistent_email()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'nonexistent@example.com',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_registration_with_very_long_name()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => Str::random(300),
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'pseudo' => 'testuser',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_registration_with_special_characters_in_name()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test@User#123',
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'pseudo' => 'testuser',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_registration_with_password_matching_email()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'test@example.com',
            'password_confirmation' => 'test@example.com',
            'pseudo' => 'testuser',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_registration_with_spaces_in_password()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'Password 123!',
            'password_confirmation' => 'Password 123!',
            'pseudo' => 'testuser',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_login_with_case_insensitive_email()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('Password123!'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'TEST@EXAMPLE.COM',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'user',
                'token',
            ]);
    }

    public function test_logout_with_invalid_token()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer invalid_token',
        ])->postJson('/api/auth/logout');

        $response->assertStatus(401);
    }

    public function test_get_user_with_invalid_token()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer invalid_token',
        ])->getJson('/api/auth/user');

        $response->assertStatus(401);
    }

    public function test_registration_with_very_long_pseudo()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'pseudo' => Str::random(100),
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['pseudo']);
    }

    public function test_registration_with_special_characters_in_pseudo()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'pseudo' => 'test@user#123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['pseudo']);
    }

    public function test_multiple_login_attempts_same_user()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('Password123!'),
        ]);

        // First login
        $response1 = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'Password123!',
        ]);

        $response1->assertStatus(200);

        // Second login
        $response2 = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'Password123!',
        ]);

        $response2->assertStatus(200);

        // Verify both tokens are different
        $this->assertNotEquals(
            $response1->json('token'),
            $response2->json('token')
        );
    }

    public function test_registration_password_mismatch()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'DifferentPassword123!',
            'pseudo' => 'testuser',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }
}
