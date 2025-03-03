<?php

namespace App\Extensions;

use Illuminate\Auth\EloquentUserProvider;
use Illuminate\Contracts\Auth\Authenticatable;

class CustomUserProvider extends EloquentUserProvider
{
    public function validateCredentials(Authenticatable $user, array $credentials): bool
    {
        // Check if account is active
        if (!$user->is_active) {
            return false;
        }

        // Check if account is locked
        if ($user->isLocked()) {
            return false;
        }

        // Validate password
        $plain = $credentials['password'];
        $hashedValue = $user->getAuthPassword();

        $valid = $this->hasher->check($plain, $hashedValue);

        if ($valid) {
            $user->resetLoginAttempts();
        } else {
            $user->incrementLoginAttempts();
        }

        return $valid;
    }

    public function retrieveByCredentials(array $credentials)
    {
        $user = parent::retrieveByCredentials($credentials);

        if ($user) {
            // Convert email to lowercase for case-insensitive comparison
            $credentials['email'] = strtolower(trim($credentials['email']));
            if ($user->email === $credentials['email']) {
                return $user;
            }
        }

        return null;
    }
}
