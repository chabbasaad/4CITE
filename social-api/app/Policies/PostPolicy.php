<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PostPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Admin can view all posts
        return $user->hasRole('admin') || $user->hasPermissionTo('view content');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Post $post): bool
    {
        // Admin can view any post, others can view only their own or public posts
        return $user->hasRole('admin') || $post->user_id === $user->id || $user->hasPermissionTo('view content');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Admin and content creators can create posts
        return $user->role === "admin" || $user->role === "content_creator" ;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Post $post): bool
    {
        // Admin can update any post, others can update only their own posts
        return $user->role === "admin" || ($post->user_id === $user->id && $user->hasPermissionTo('edit content'));
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Post $post): bool
    {

        // Admin can delete any post, others can delete only their own posts
        return $user->role == "admin" || $post->user_id === $user->id ;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Post $post): bool
    {
        // Admin can restore any post
        return $user->role == "admin";
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Post $post): bool
    {
        // Admin can permanently delete any post
        return $user->role == "admin";
    }
}
