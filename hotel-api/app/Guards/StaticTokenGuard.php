<?php

namespace App\Guards;

use App\Models\User;
use Illuminate\Auth\GuardHelpers;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;

class StaticTokenGuard implements Guard
{
    use GuardHelpers;

    protected $request;
    protected $staticTokens;

    public function __construct(Request $request)
    {
        $this->request = $request;

        // Define static tokens and their corresponding user data
        $this->staticTokens = [
            'static_admin_token_123456' => [
                'id' => 1,
                'name' => 'Static Admin',
                'email' => 'static.admin@test.com',
                'pseudo' => 'staticadmin',
                'role' => 'admin'
            ],
            'static_user_token_123456' => [
                'id' => 2,
                'name' => 'Static User',
                'email' => 'static.user@test.com',
                'pseudo' => 'staticuser',
                'role' => 'user'
            ]
        ];
    }

    public function user()
    {
        if ($this->user !== null) {
            return $this->user;
        }

        $token = $this->getTokenFromRequest();

        if (!$token || !isset($this->staticTokens[$token])) {
            return null;
        }

        // Create a user instance from static data
        $userData = $this->staticTokens[$token];
        $user = new User();

        foreach ($userData as $key => $value) {
            $user->setAttribute($key, $value);
        }

        return $this->user = $user;
    }

    public function validate(array $credentials = [])
    {
        $token = $credentials['token'] ?? $this->getTokenFromRequest();
        return isset($this->staticTokens[$token]);
    }

    protected function getTokenFromRequest()
    {
        $token = $this->request->bearerToken();

        if (!$token && $this->request->has('api_token')) {
            $token = $this->request->input('api_token');
        }

        return $token;
    }
}
