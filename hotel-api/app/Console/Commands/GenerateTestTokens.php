<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class GenerateTestTokens extends Command
{
    protected $signature = 'tokens:generate-test {--env-format : Output tokens in environment variable format}';
    protected $description = 'Generate test tokens for admin, employee, and user roles';

    public function handle()
    {
        $this->info('Generating test tokens...');

        // Create admin user if not exists
        $admin = User::firstOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Test Admin',
                'pseudo' => 'testadmin',
                'password' => Hash::make('Admin123!'),
                'role' => User::ROLE_ADMIN
            ]
        );
        $adminToken = $admin->createToken('test-token')->plainTextToken;

        // Create employee user if not exists
        $employee = User::firstOrCreate(
            ['email' => 'employee@test.com'],
            [
                'name' => 'Test Employee',
                'pseudo' => 'testemployee',
                'password' => Hash::make('Employee123!'),
                'role' => User::ROLE_EMPLOYEE
            ]
        );
        $employeeToken = $employee->createToken('test-token')->plainTextToken;

        // Create regular user if not exists
        $user = User::firstOrCreate(
            ['email' => 'user@test.com'],
            [
                'name' => 'Test User',
                'pseudo' => 'testuser',
                'password' => Hash::make('User123!'),
                'role' => User::ROLE_USER
            ]
        );
        $userToken = $user->createToken('test-token')->plainTextToken;

        if ($this->option('env-format')) {
            // Output in environment variable format
            $this->line('TEST_ADMIN_TOKEN=' . $adminToken);
            $this->line('TEST_EMPLOYEE_TOKEN=' . $employeeToken);
            $this->line('TEST_USER_TOKEN=' . $userToken);
        } else {
            // Standard output format
            $this->info('Test tokens generated successfully!');
            $this->info('');
            $this->info('Admin Token (admin@test.com):');
            $this->info($adminToken);
            $this->info('');
            $this->info('Employee Token (employee@test.com):');
            $this->info($employeeToken);
            $this->info('');
            $this->info('User Token (user@test.com):');
            $this->info($userToken);
        }
    }
}
