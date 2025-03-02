<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin can list all users', function () {
    // Clear any existing users
    User::query()->delete();

    User::factory()->count(4)->create();

    $response = actingAsAdmin()->getJson('/api/users');

    $response->assertStatus(200)
        ->assertJsonStructure(['data'])
        ->assertJsonCount(5, 'data'); // 4 created users + 1 admin
});

test('employee can list all users', function () {
    // Clear any existing users
    User::query()->delete();

    User::factory()->count(4)->create();

    $response = actingAsEmployee()->getJson('/api/users');

    $response->assertStatus(200)
        ->assertJsonStructure(['data'])
        ->assertJsonCount(5, 'data'); // 4 created users + 1 employee
});

test('normal user cannot list all users', function () {
    User::factory()->count(3)->create();

    $response = actingAsUser()
        ->getJson('/api/users');

    $response->assertStatus(403);
});

test('admin can create user', function () {
    $response = actingAsAdmin()
        ->postJson('/api/users', [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'user',
            'pseudo' => 'newuser'
        ]);

    $response->assertStatus(201);
    expect(User::where('email', 'newuser@example.com')->exists())->toBeTrue();
});

test('admin can update user', function () {
    $user = User::factory()->create();

    $response = actingAsAdmin()
        ->putJson("/api/users/{$user->id}", [
            'name' => 'Updated Name',
            'role' => 'employee'
        ]);

    $response->assertStatus(200);
    expect($user->fresh()->name)->toBe('Updated Name');
    expect($user->fresh()->role)->toBe('employee');
});

test('admin can delete user', function () {
    $user = User::factory()->create();

    $response = actingAsAdmin()
        ->deleteJson("/api/users/{$user->id}");

    $response->assertStatus(200);
    expect(User::find($user->id))->toBeNull();
});

test('user can update own profile', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->putJson("/api/users/{$user->id}", [
            'name' => 'Updated Name',
            'pseudo' => 'newpseudo'
        ]);

    $response->assertStatus(200);
    expect($user->fresh()->name)->toBe('Updated Name');
    expect($user->fresh()->pseudo)->toBe('newpseudo');
});

test('user cannot update others profile', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    $response = $this->actingAs($user1)
        ->putJson("/api/users/{$user2->id}", [
            'name' => 'Updated Name'
        ]);

    $response->assertStatus(403);
});

test('user cannot change their role', function () {
    $user = User::factory()->create(['role' => 'user']);

    $response = $this->actingAs($user)
        ->putJson("/api/users/{$user->id}", [
            'role' => 'admin'
        ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['role']);
});

test('admin can view all users', function () {
    // Clear any existing users
    User::query()->delete();

    $admin = User::factory()->create(['role' => 'admin']);
    User::factory()->count(4)->create();

    $response = $this->actingAs($admin)->getJson('/api/users');

    $response->assertStatus(200)
        ->assertJsonCount(5, 'data');  // 4 created users + 1 admin
});
