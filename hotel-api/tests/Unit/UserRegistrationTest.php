<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

uses(Tests\TestCase::class)->in('Unit');

beforeEach(function () {
    // Clean up the users table before each test
    User::query()->delete();
});

test('user can be created with valid data', function () {
    $userData = [
        'name' => 'Saad chabba',
        'email' => 'saad.chabba@example.com',
        'password' => 'Password123!',
        'pseudo' => 'Saadchabba',
    ];

    $user = User::create([
        'name' => $userData['name'],
        'email' => $userData['email'],
        'password' => Hash::make($userData['password']),
        'pseudo' => $userData['pseudo'],
    ]);

    expect($user)->toBeInstanceOf(User::class)
        ->and($user->name)->toBe($userData['name'])
        ->and($user->email)->toBe($userData['email'])
        ->and($user->pseudo)->toBe($userData['pseudo'])
        ->and(Hash::check($userData['password'], $user->password))->toBeTrue();
});

test('user cannot register with existing email', function () {
    // Create an existing user
    User::create([
        'name' => 'Existing User',
        'email' => 'existing@example.com',
        'password' => Hash::make('Password123!'),
        'pseudo' => 'existinguser',
    ]);

    $validator = Validator::make([
        'email' => 'existing@example.com',
    ], [
        'email' => 'unique:users,email',
    ]);

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->has('email'))->toBeTrue();
});

test('validates password strength', function () {
    $weakPasswords = [
        'short',         // Too short
        'nouppercaseornumbers',  // No uppercase or numbers
        'NoSpecialChars123',     // No special characters
        'Only@symbols',          // No numbers
        '12345678',             // Only numbers
    ];

    foreach ($weakPasswords as $password) {
        $validator = Validator::make(['password' => $password], [
            'password' => ['required', Password::min(8)
                ->mixedCase()
                ->numbers()
                ->symbols()],
        ]);

        expect($validator->fails())->toBeTrue()
            ->and($validator->errors()->has('password'))->toBeTrue();
    }
});

test('validates email format', function () {
    $invalidEmails = [
        'notanemail',
        'missing@',
        '@nodomain.com',
        'spaces in@email.com',
        'double@@domain.com',
        '.invalid@email.com',
        'invalid@.com',
        'invalid@domain.',
        'invalid@domain..com',
    ];

    foreach ($invalidEmails as $email) {
        $validator = Validator::make(['email' => $email], [
            'email' => 'required|email:rfc,dns',
        ]);

        expect($validator->fails())->toBeTrue()
            ->and($validator->errors()->has('email'))->toBeTrue();
    }
});

test('trims email spaces before validation', function () {
    $email = '  saad.chabba@example.com  ';
    $trimmedEmail = trim($email);

    $userData = [
        'name' => 'Saad chabba',
        'email' => $email,
        'password' => 'Password123!',
        'pseudo' => 'Saadchabba',
    ];

    // Create a user model instance but modify the email before saving
    $user = new User($userData);
    $user->email = $email; // This will trigger the mutator
    $user->password = Hash::make($userData['password']);
    $user->save();

    expect($user->email)->toBe($trimmedEmail);
});

test('validates pseudo uniqueness', function () {
    // Create an existing user with a pseudo
    User::create([
        'name' => 'Existing User',
        'email' => 'existing@example.com',
        'password' => Hash::make('Password123!'),
        'pseudo' => 'saadchabba',
    ]);

    $validator = Validator::make([
        'pseudo' => 'saadchabba',
    ], [
        'pseudo' => 'unique:users,pseudo',
    ]);

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->has('pseudo'))->toBeTrue();
});

test('validates name length', function () {
    $veryLongName = str_repeat('a', 256); // Create a string longer than typical max length

    $validator = Validator::make([
        'name' => $veryLongName,
    ], [
        'name' => 'max:255',
    ]);

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->has('name'))->toBeTrue();
});

test('validates pseudo format', function () {
    $invalidPseudos = [
        'a', // too short
        str_repeat('a', 51), // too long
        'special@chars', // special characters
        'spaces not allowed', // spaces
    ];

    foreach ($invalidPseudos as $pseudo) {
        $validator = Validator::make(['pseudo' => $pseudo], [
            'pseudo' => ['required', 'min:3', 'max:50', 'regex:/^[a-zA-Z0-9]+$/'],
        ]);

        expect($validator->fails())->toBeTrue()
            ->and($validator->errors()->has('pseudo'))->toBeTrue();
    }
});

test('validates password does not match email or name', function () {
    $userData = [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'john@example.com', // Same as email
    ];

    $validator = Validator::make($userData, [
        'password' => [
            'required',
            function ($attribute, $value, $fail) use ($userData) {
                if (strtolower($value) === strtolower($userData['email']) ||
                    strtolower($value) === strtolower($userData['name'])) {
                    $fail('Password cannot be the same as your email or name.');
                }
            },
        ],
    ]);

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->has('password'))->toBeTrue();
});

test('validates name contains only letters and spaces', function () {
    $invalidNames = [
        'John123',
        'John@Doe',
        'John_Doe',
        '123456',
    ];

    foreach ($invalidNames as $name) {
        $validator = Validator::make(['name' => $name], [
            'name' => ['required', 'regex:/^[a-zA-Z\s]+$/'],
        ]);

        expect($validator->fails())->toBeTrue()
            ->and($validator->errors()->has('name'))->toBeTrue();
    }
});

test('validates password maximum length', function () {
    $tooLongPassword = str_repeat('A', 101) . 'a1@'; // More than 100 characters

    $validator = Validator::make(['password' => $tooLongPassword], [
        'password' => ['required', 'max:100'],
    ]);

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->has('password'))->toBeTrue();
});

test('validates required fields are present', function () {
    $validator = Validator::make([], [
        'name' => 'required',
        'email' => 'required',
        'password' => 'required',
        'pseudo' => 'required',
    ]);

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->has('name'))->toBeTrue()
        ->and($validator->errors()->has('email'))->toBeTrue()
        ->and($validator->errors()->has('password'))->toBeTrue()
        ->and($validator->errors()->has('pseudo'))->toBeTrue();
});
