<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          // Create sample users
        $adminUser = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);
        $contentCreatorUser = User::create([
            'name' => 'Content Creator',
            'email' => 'creator@example.com',
            'password' => bcrypt('password'),
        ]);
        $regularUser = User::create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'password' => bcrypt('password'),
        ]);

        // Assign roles to users
        $adminUser->assignRole('admin');
        $contentCreatorUser->assignRole('content_creator');
        $regularUser->assignRole('user');
    }
}
