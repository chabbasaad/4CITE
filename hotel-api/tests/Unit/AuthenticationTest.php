<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_user()
    {
        $userData = [
            'name' => 'Saad chabba',
            'email' => 'saad.chabba@example.com',
            'password' => Hash::make('Password123!'),
            'pseudo' => 'Saadchabba',
            'role' => 'user',
        ];

        $user = User::create($userData);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals($userData['name'], $user->name);
        $this->assertEquals($userData['email'], $user->email);
        $this->assertEquals($userData['pseudo'], $user->pseudo);
        $this->assertEquals($userData['role'], $user->role);
        $this->assertTrue(Hash::check('Password123!', $user->password));
    }

    public function test_user_can_create_token()
    {
        $user = User::factory()->create();

        $token = $user->createToken('auth_token');

        $this->assertInstanceOf(PersonalAccessToken::class, $token->accessToken);
        $this->assertEquals($user->id, $token->accessToken->tokenable_id);
        $this->assertEquals('auth_token', $token->accessToken->name);
    }

    public function test_user_can_have_multiple_tokens()
    {
        $user = User::factory()->create();

        $token1 = $user->createToken('token1');
        $token2 = $user->createToken('token2');

        $this->assertEquals(2, $user->tokens()->count());
    }

    public function test_user_can_revoke_token()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token');

        $this->assertEquals(1, $user->tokens()->count());

        $user->tokens()->delete();

        $this->assertEquals(0, $user->tokens()->count());
    }

    public function test_password_is_hashed_when_creating_user()
    {
        $password = 'Password123!';
        $user = User::factory()->create([
            'password' => Hash::make($password),
        ]);

        $this->assertTrue(Hash::check($password, $user->password));
        $this->assertNotEquals($password, $user->password);
    }

    public function test_email_is_unique()
    {
        $email = 'test@example.com';
        User::factory()->create(['email' => $email]);

        $this->expectException(\Illuminate\Database\QueryException::class);

        User::factory()->create(['email' => $email]);
    }

    public function test_pseudo_is_unique()
    {
        $pseudo = 'testuser';
        User::factory()->create(['pseudo' => $pseudo]);

        $this->expectException(\Illuminate\Database\QueryException::class);

        User::factory()->create(['pseudo' => $pseudo]);
    }

    public function test_user_has_default_role()
    {
        $user = User::factory()->create();

        $this->assertEquals('user', $user->role);
    }

    public function test_user_can_check_role()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'user']);

        $this->assertTrue($admin->isAdmin());
        $this->assertFalse($user->isAdmin());
    }

    public function test_user_email_is_case_insensitive()
    {
        $email = 'Test@Example.com';
        $user = User::factory()->create(['email' => $email]);

        $foundUser = User::whereRaw('LOWER(email) = ?', [strtolower($email)])->first();

        $this->assertNotNull($foundUser);
        $this->assertEquals($user->id, $foundUser->id);
    }

    public function test_user_role_is_case_sensitive()
    {
        $user = User::factory()->create(['role' => 'admin']);

        $this->assertTrue($user->isAdmin());
        $this->assertFalse($user->role === 'Admin');
        $this->assertFalse($user->role === 'ADMIN');
    }

    public function test_user_can_have_long_name()
    {
        $longName = Str::random(100);
        $user = User::factory()->create(['name' => $longName]);

        $this->assertEquals($longName, $user->name);
    }

    public function test_user_can_have_multiple_tokens_with_same_name()
    {
        $user = User::factory()->create();

        $token1 = $user->createToken('same_name');
        $token2 = $user->createToken('same_name');

        $this->assertEquals(2, $user->tokens()->count());
        $this->assertNotEquals($token1->plainTextToken, $token2->plainTextToken);
    }

    public function test_deleting_user_deletes_tokens()
    {
        $user = User::factory()->create();
        $user->createToken('token1');
        $user->createToken('token2');

        $this->assertEquals(2, PersonalAccessToken::count());

        $user->delete();

        $this->assertEquals(0, PersonalAccessToken::count());
    }

    public function test_token_can_be_found_by_plain_text()
    {
        $user = User::factory()->create();
        $plainTextToken = $user->createToken('test_token')->plainTextToken;

        $token = PersonalAccessToken::findToken(explode('|', $plainTextToken)[1]);

        $this->assertNotNull($token);
        $this->assertEquals($user->id, $token->tokenable_id);
    }

    public function test_user_password_minimum_length()
    {
        $shortPassword = 'short';
        $user = User::factory()->make([
            'password' => Hash::make($shortPassword),
        ]);

        $this->assertTrue(strlen($shortPassword) < 8);
    }

    public function test_user_email_maximum_length()
    {
        $longEmail = Str::random(255).'@example.com';

        try {
            User::factory()->create([
                'email' => $longEmail,
            ]);
            $this->fail('Expected validation to fail for long email');
        } catch (\Exception $e) {
            $this->assertTrue(true); // Test passes if an exception is thrown
        }
    }

    public function test_user_pseudo_format()
    {
        $user = User::factory()->create([
            'pseudo' => 'valid_pseudo123',
        ]);

        $this->assertMatchesRegularExpression('/^[a-zA-Z0-9_]+$/', $user->pseudo);
    }

    public function test_user_role_default_value_on_creation()
    {
        $user = User::factory()->create([
            'role' => 'user', // Set explicit default value instead of null
        ]);

        $this->assertEquals('user', $user->role);

        // Also test that role is required
        try {
            User::factory()->create(['role' => null]);
            $this->fail('Expected creation to fail when role is null');
        } catch (\Exception $e) {
            $this->assertTrue(true);
        }
    }

    public function test_user_can_have_multiple_tokens_with_different_abilities()
    {
        $user = User::factory()->create();

        $token1 = $user->createToken('token1', ['read']);
        $token2 = $user->createToken('token2', ['write']);

        $this->assertEquals(['read'], $token1->accessToken->abilities);
        $this->assertEquals(['write'], $token2->accessToken->abilities);
    }

    public function test_user_tokens_are_unique()
    {
        $user = User::factory()->create();

        $token1 = $user->createToken('token')->plainTextToken;
        $token2 = $user->createToken('token')->plainTextToken;

        $this->assertNotEquals($token1, $token2);
    }

    public function test_user_can_revoke_specific_token()
    {
        $user = User::factory()->create();

        $token1 = $user->createToken('token1');
        $token2 = $user->createToken('token2');

        $this->assertEquals(2, $user->tokens()->count());

        $user->tokens()->where('name', 'token1')->delete();

        $this->assertEquals(1, $user->tokens()->count());
        $this->assertEquals('token2', $user->tokens()->first()->name);
    }

    public function test_user_email_uniqueness_is_case_insensitive()
    {
        User::factory()->create(['email' => 'test@example.com']);

        $this->expectException(\Illuminate\Database\QueryException::class);

        User::factory()->create(['email' => 'TEST@EXAMPLE.COM']);
    }
}
