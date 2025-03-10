<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Laravel\Sanctum\PersonalAccessToken;

class LogoutTest extends TestCase
{
    use RefreshDatabase;

    private $testUser;
    private $testAdmin;
    private $testEmployee;
    private $testToken;
    private $testAdminToken;
    private $testEmployeeToken;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test users with different roles
        $this->testUser = User::factory()->create([
            'email' => 'testuser@example.com',
            'role' => 'user'
        ]);

        $this->testAdmin = User::factory()->create([
            'email' => 'testadmin@example.com',
            'role' => 'admin'
        ]);

        $this->testEmployee = User::factory()->create([
            'email' => 'testemployee@example.com',
            'role' => 'employee'
        ]);

        // Create tokens for each user with different abilities
        $this->testToken = $this->testUser->createToken('auth_token', ['user'])->accessToken;
        $this->testAdminToken = $this->testAdmin->createToken('auth_token', ['admin'])->accessToken;
        $this->testEmployeeToken = $this->testEmployee->createToken('auth_token', ['employee'])->accessToken;
    }

    protected function tearDown(): void
    {
        // Clean up all tokens
        PersonalAccessToken::query()->delete();

        // Clean up test data
        $this->testUser = null;
        $this->testAdmin = null;
        $this->testEmployee = null;
        $this->testToken = null;
        $this->testAdminToken = null;
        $this->testEmployeeToken = null;

        parent::tearDown();
    }

    public function test_token_deletion()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token');

        $this->assertEquals(1, $user->tokens()->count());

        $user->tokens()->delete();

        $this->assertEquals(0, $user->tokens()->count());
    }

    public function test_multiple_tokens_deletion()
    {
        $user = User::factory()->create();

        // Create multiple tokens
        $user->createToken('token1');
        $user->createToken('token2');
        $user->createToken('token3');

        $this->assertEquals(3, $user->tokens()->count());

        $user->tokens()->delete();

        $this->assertEquals(0, $user->tokens()->count());
    }

    public function test_specific_token_deletion()
    {
        $user = User::factory()->create();

        $token1 = $user->createToken('token1');
        $token2 = $user->createToken('token2');

        $this->assertEquals(2, $user->tokens()->count());

        // Delete specific token
        $user->tokens()->where('id', $token1->accessToken->id)->delete();

        $this->assertEquals(1, $user->tokens()->count());
        $this->assertEquals('token2', $user->tokens()->first()->name);
    }

    public function test_token_invalidation_after_deletion()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token');
        $plainTextToken = $token->plainTextToken;

        // Delete the token
        $user->tokens()->delete();

        // Try to find the token
        $foundToken = PersonalAccessToken::findToken(explode('|', $plainTextToken)[1]);

        $this->assertNull($foundToken);
    }

    public function test_user_tokens_deletion_on_user_deletion()
    {
        // Clean up tokens from setup
        PersonalAccessToken::query()->delete();

        $user = User::factory()->create();

        // Create multiple tokens
        $user->createToken('token1');
        $user->createToken('token2');

        $this->assertEquals(2, PersonalAccessToken::count());

        $user->delete();

        $this->assertEquals(0, PersonalAccessToken::count());
    }

    public function test_token_creation_after_logout()
    {
        // Clean up tokens from setup
        PersonalAccessToken::query()->delete();

        $user = User::factory()->create();

        // Create and delete token (simulating logout)
        $user->createToken('first_token');
        $user->tokens()->delete();

        // Create new token after logout
        $newToken = $user->createToken('new_token');

        $this->assertEquals(1, $user->tokens()->count());
        $this->assertEquals('new_token', $newToken->accessToken->name);
    }

    public function test_token_abilities_after_recreation()
    {
        // Clean up tokens from setup
        PersonalAccessToken::query()->delete();

        $user = User::factory()->create();

        // Create token with abilities
        $token = $user->createToken('auth_token', ['read']);

        // Delete token (logout)
        $user->tokens()->delete();

        // Create new token with different abilities
        $newToken = $user->createToken('new_token', ['write']);

        $this->assertTrue($newToken->accessToken->can('write'));
        $this->assertFalse($newToken->accessToken->can('read'));
    }

    public function test_concurrent_token_deletions()
    {
        // Clean up tokens from setup
        PersonalAccessToken::query()->delete();

        $user = User::factory()->create();

        // Create multiple tokens
        $tokens = collect([
            $user->createToken('token1'),
            $user->createToken('token2'),
            $user->createToken('token3')
        ]);

        $this->assertEquals(3, $user->tokens()->count());

        // Delete tokens concurrently
        $user->tokens()->delete();

        $this->assertEquals(0, $user->tokens()->count());
    }

    public function test_token_deletion_idempotency()
    {
        // Clean up tokens from setup
        PersonalAccessToken::query()->delete();

        $user = User::factory()->create();
        $token = $user->createToken('auth_token');

        // Delete tokens multiple times
        $user->tokens()->delete();
        $user->tokens()->delete();
        $user->tokens()->delete();

        $this->assertEquals(0, $user->tokens()->count());
    }
}
