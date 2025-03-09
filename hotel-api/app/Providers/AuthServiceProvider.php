<?php

namespace App\Providers;

use App\Models\Booking;
use App\Models\User;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // User Management
        Gate::define('manage_users', fn (User $user) => $user->isAdmin());
        Gate::define('view_users', fn (User $user) => $user->isStaff());

        // Hotel Management
        Gate::define('manage_hotels', fn (User $user) => $user->isAdmin());
        Gate::define('create_hotel', fn (User $user) => $user->isAdmin());
        Gate::define('update_hotel', fn (User $user) => $user->isAdmin());
        Gate::define('delete_hotel', fn (User $user) => $user->isAdmin());

        // Profile Access
        Gate::define('view_profile', fn (User $user) => true);
        Gate::define('view_any_profile', fn (User $user) => $user->isStaff());

        // Booking Management
        Gate::define('create_booking', fn (User $user) => true);
        Gate::define('view_own_bookings', fn (User $user) => true);
        Gate::define('view_all_bookings', fn (User $user) => $user->isStaff());
    }
}
