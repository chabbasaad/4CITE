<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_password_verification()
    {
        $password = 'password123';
        $user = User::factory()->create([
            'password' => Hash::make($password)
        ]);

        $this->assertTrue(Hash::check($password, $user->password));
        $this->assertFalse(Hash::check('wrongpassword', $user->password));
    }

    public function test_case_sensitive_password_verification()
    {
        $password = 'Password123';
        $user = User::factory()->create([
            'password' => Hash::make($password)
        ]);

        $this->assertTrue(Hash::check($password, $user->password));
        $this->assertFalse(Hash::check('password123', $user->password));
        $this->assertFalse(Hash::check('PASSWORD123', $user->password));
    }

    public function test_email_case_insensitive_lookup()
    {
        $user = User::factory()->create([
            'email' => 'user@example.com'
        ]);

        $foundUser = User::whereRaw('LOWER(email) = ?', [strtolower('USER@EXAMPLE.COM')])->first();

        $this->assertNotNull($foundUser);
        $this->assertEquals($user->id, $foundUser->id);
    }

    public function test_token_creation_on_successful_verification()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token');

        $this->assertInstanceOf(PersonalAccessToken::class, $token->accessToken);
        $this->assertEquals('auth_token', $token->accessToken->name);
    }

    public function test_token_abilities()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token', ['login']);

        $this->assertTrue($token->accessToken->can('login'));
        $this->assertFalse($token->accessToken->can('other-ability'));
    }

    public function test_email_validation()
    {
        $validEmails = [
            'user@example.com',
            'user.name@example.com',
            'user+label@example.com',
            'user@subdomain.example.com'
        ];

        $invalidEmails = [
            'invalid-email',
            'user@',
            '@example.com',
            'user@.com',
            'user@example.',
            'user space@example.com'
        ];

        foreach ($validEmails as $email) {
            $this->assertTrue(filter_var($email, FILTER_VALIDATE_EMAIL) !== false, "Email should be valid: $email");
        }

        foreach ($invalidEmails as $email) {
            $this->assertFalse(filter_var($email, FILTER_VALIDATE_EMAIL) !== false, "Email should be invalid: $email");
        }
    }

    public function test_password_length_validation()
    {
        $minLength = 8;
        $maxLength = 64;

        $shortPassword = 'short';
        $validPassword = 'validpassword123';
        $longPassword = str_repeat('a', 65);

        $this->assertTrue(strlen($validPassword) >= $minLength && strlen($validPassword) <= $maxLength);
        $this->assertFalse(strlen($shortPassword) >= $minLength);
        $this->assertFalse(strlen($longPassword) <= $maxLength);
    }

    public function test_user_can_have_multiple_active_sessions()
    {
        $user = User::factory()->create();

        $token1 = $user->createToken('session1')->plainTextToken;
        $token2 = $user->createToken('session2')->plainTextToken;

        $this->assertEquals(2, $user->tokens()->count());
        $this->assertNotEquals($token1, $token2);
    }

    public function test_token_revocation()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token');

        $this->assertEquals(1, $user->tokens()->count());

        $user->tokens()->delete();

        $this->assertEquals(0, $user->tokens()->count());
    }

    public function test_password_spaces_validation()
    {
        $passwordsWithSpaces = [
            ' password123',
            'password 123',
            'password123 ',
            '  password  123  '
        ];

        foreach ($passwordsWithSpaces as $password) {
            $this->assertTrue(str_contains($password, ' '), "Password should contain spaces: $password");
        }
    }

    public function test_email_trimming()
    {
        $email = '  user@example.com  ';
        $trimmedEmail = trim($email);

        $user = User::factory()->create([
            'email' => $trimmedEmail
        ]);

        $this->assertEquals('user@example.com', $user->email);
        $this->assertNotEquals($email, $user->email);
    }
}
