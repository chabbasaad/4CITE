<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin users
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'pseudo' => 'admin1',
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Second Admin',
            'email' => 'admin2@example.com',
            'password' => Hash::make('password123'),
            'pseudo' => 'admin2',
            'role' => 'admin',
        ]);

        // Create employee users
        for ($i = 1; $i <= 3; $i++) {
            User::create([
                'name' => "Employee $i",
                'email' => "employee$i@example.com",
                'password' => Hash::make('password123'),
                'pseudo' => "employee$i",
                'role' => 'employee',
            ]);
        }

        // Create regular users
        for ($i = 1; $i <= 10; $i++) {
            User::create([
                'name' => "User $i",
                'email' => "user$i@example.com",
                'password' => Hash::make('password123'),
                'pseudo' => "user$i",
                'role' => 'user',
            ]);
        }
    }
}
