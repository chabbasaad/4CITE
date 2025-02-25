<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;


class FollowController extends Controller
{
   /**
     * Follow a user.
     */
    public function follow($id)
    {
        $userToFollow = User::findOrFail($id);

        // Check if the profile is public
        if ($userToFollow->profile_type === 'private') {
            return response()->json(['message' => 'Cannot follow a private profile'], 403);
        }

        // Check if already following
        if (Auth::user()->following()->where('following_id', $id)->exists()) {
            return response()->json(['message' => 'Already following this user'], 400);
        }

        // Add follow relationship
        Auth::user()->following()->attach($id);

        return response()->json(['message' => 'User followed successfully']);
    }

    /**
     * Unfollow a user.
     */
    public function unfollow($id)
    {
        $userToUnfollow = User::findOrFail($id);

        // Check if already following
        if (!Auth::user()->following()->where('following_id', $id)->exists()) {
            return response()->json(['message' => 'You are not following this user'], 400);
        }

        // Remove follow relationship
        Auth::user()->following()->detach($id);

        return response()->json(['message' => 'User unfollowed successfully']);
    }

    /**
     * Get followers of a user.
     */
    public function followers($id)
    {
        $user = User::findOrFail($id);

        // Respect profile privacy
        if ($user->profile_type === 'private' && Auth::id() !== $id) {
            return response()->json(['message' => 'This profile is private'], 403);
        }

        return response()->json($user->followers()->get());
    }

    /**
     * Get users that a user is following.
     */
    public function following($id)
    {
        $user = User::findOrFail($id);

        // Respect profile privacy
        if ($user->profile_type === 'private' && Auth::id() !== $id) {
            return response()->json(['message' => 'This profile is private'], 403);
        }

        return response()->json($user->following()->get());
    }
}
