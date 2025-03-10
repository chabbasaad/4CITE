<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomAuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Try static token authentication first
        if (Auth::guard('api')->check()) {
            return $next($request);
        }

        // If static token fails, try Sanctum
        if (Auth::guard('sanctum')->check()) {
            return $next($request);
        }

        return response()->json(['message' => 'Unauthenticated.'], 401);
    }
}
