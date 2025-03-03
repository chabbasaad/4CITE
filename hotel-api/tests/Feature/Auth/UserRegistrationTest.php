<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Testing\Fluent\AssertableJson;

test('new user can register successfully', function () {
    $response = $this->postJson('/api/auth/register', [
        'name' => 'John Doe',
        'email' => 'john.doe@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'pseudo' => 'johndoe'
    ]);

    $response->assertStatus(201)
        ->assertJson(fn (AssertableJson $json) =>
            $json->has('token')
                ->has('user')
                ->where('message', 'Registration successful')
                ->where('user.name', 'John Doe')
                ->where('user.email', 'john.doe@example.com')
                ->where('user.pseudo', 'johndoe')
        );

    $user = User::where('email', 'john.doe@example.com')->first();
    expect($user)->not->toBeNull()
        ->and($user->name)->toBe('John Doe')
        ->and($user->pseudo)->toBe('johndoe')
        ->and(Hash::check('Password123!', $user->password))->toBeTrue();
});

test('user cannot register with existing email', function () {
    // Create an existing user
    User::factory()->create([
        'email' => 'existing@example.com'
    ]);

    $response = $this->postJson('/api/auth/register', [
        'name' => 'Another User',
        'email' => 'existing@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'pseudo' => 'anotheruser'
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('user cannot register with invalid data', function () {
    // Test with invalid data
    $response = $this->postJson('/api/auth/register', [
        'name' => 'Jo',
        'email' => 'invalid-email',
        'password' => 'pass',
        'password_confirmation' => 'pass',
        'pseudo' => 'jo'
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'email', 'password']);

    // Verify no user was created
    expect(User::where('email', 'invalid-email')->exists())->toBeFalse();
});

test('registration requires all fields', function () {
    // Test with missing required fields
    $response = $this->postJson('/api/auth/register', [
        'name' => 'John Doe',
        // missing email
        'password' => 'Password123!',
        // missing pseudo
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email', 'pseudo']);
});
