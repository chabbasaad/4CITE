<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function setUp(): void
    {
        parent::setUp();

        
        // Disable foreign key checks during tests
        if (DB::connection()->getDriverName() === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = OFF');
        }

        // Increase SQLite memory limit
        if (DB::connection()->getDriverName() === 'sqlite') {
            DB::statement('PRAGMA temp_store = MEMORY');
            DB::statement('PRAGMA journal_mode = OFF');
        }
    }

    protected function tearDown(): void
    {
        // Clean up after each test
        $this->beforeApplicationDestroyed(function () {
            DB::disconnect();
        });

        parent::tearDown();
    }
}
