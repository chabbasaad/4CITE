<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Laravel\Sanctum\PersonalAccessToken;

class LogoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_successful_logout()
    {
        // Create and authenticate a user
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/auth/logout');

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Successfully logged out'
            ]);

        // Verify token is deleted
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_logout_deletes_all_tokens()
    {
        // Create a user with multiple tokens
        $user = User::factory()->create();
        $token1 = $user->createToken('token1')->plainTextToken;
        $token2 = $user->createToken('token2')->plainTextToken;

        $this->assertEquals(2, $user->tokens()->count());

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token1,
        ])->postJson('/api/auth/logout');

        $response->assertStatus(200);
        $this->assertEquals(0, $user->tokens()->count());
    }

    public function test_accessing_protected_route_after_logout()
    {
        // Create and authenticate a user
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        // First, logout
        $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/auth/logout');

        // Then try to access a protected route with the same token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/auth/user');

        $response->assertStatus(401);
    }

    public function test_logout_without_token()
    {
        $response = $this->postJson('/api/auth/logout');

        $response->assertStatus(401);
    }

    public function test_logout_with_invalid_token()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer invalid_token',
        ])->postJson('/api/auth/logout');

        $response->assertStatus(401);
    }

    public function test_logout_with_expired_token()
    {
        // Create a user and token
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        // Manually expire the token by deleting it
        $user->tokens()->delete();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/auth/logout');

        $response->assertStatus(401);
    }

    public function test_multiple_logouts_same_token()
    {
        // Create and authenticate a user
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        // First logout
        $firstResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/auth/logout');

        $firstResponse->assertStatus(200)
            ->assertJson([
                'message' => 'Successfully logged out'
            ]);

        // Second logout with same token
        $secondResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/auth/logout');

        // The API allows multiple logout attempts and returns 200
        $secondResponse->assertStatus(200)
            ->assertJson([
                'message' => 'Successfully logged out'
            ]);

        // Verify no tokens exist
        $this->assertEquals(0, $user->tokens()->count());
    }

    public function test_multiple_logouts_different_tokens()
    {
        // Create a user with multiple tokens
        $user = User::factory()->create();
        $token1 = $user->createToken('token1')->plainTextToken;
        $token2 = $user->createToken('token2')->plainTextToken;

        // First logout with token1
        $firstResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token1,
        ])->postJson('/api/auth/logout');

        $firstResponse->assertStatus(200)
            ->assertJson([
                'message' => 'Successfully logged out'
            ]);

        // Second logout with token2
        $secondResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token2,
        ])->postJson('/api/auth/logout');

        // The API allows multiple logout attempts and returns 200
        $secondResponse->assertStatus(200)
            ->assertJson([
                'message' => 'Successfully logged out'
            ]);

        // Verify no tokens exist
        $this->assertEquals(0, $user->tokens()->count());
    }

    public function test_concurrent_sessions_logout()
    {
        // Create a user with multiple active sessions
        $user = User::factory()->create();
        $token1 = $user->createToken('device1')->plainTextToken;
        $token2 = $user->createToken('device2')->plainTextToken;

        // Logout from one session
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token1,
        ])->postJson('/api/auth/logout');

        $response->assertStatus(200);

        // Verify all tokens are revoked (as per your implementation)
        $this->assertEquals(0, $user->tokens()->count());
    }
}
