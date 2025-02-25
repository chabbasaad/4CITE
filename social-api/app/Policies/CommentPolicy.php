<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CommentPolicy
{
     /**
     * Determine whether the user can view any comments.
     */
    public function viewAny(User $user): bool
    {
        // Admin can view all comments, others must have "view content" permission
        return $user->hasRole('admin') || $user->hasPermissionTo('view content');
    }

    /**
     * Determine whether the user can view a specific comment.
     */
    public function view(User $user, Comment $comment): bool
    {
        // Admin can view any comment, others can view their own comments or comments on posts they own
        return $user->hasRole('admin') ||
               $comment->user_id === $user->id ||
               $comment->post->user_id === $user->id;
    }

    /**
     * Determine whether the user can create comments.
     */
    public function create(User $user): bool
    {
        // All roles except "admin" can create comments if they have "comment on content" permission
        return $user->hasPermissionTo('comment on content');
    }

    /**
     * Determine whether the user can update a comment.
     */
    public function update(User $user, Comment $comment): bool
    {
        // Admin can update any comment, others can update their own comments
        return $user->hasRole('admin') || $comment->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete a comment.
     */
    public function delete(User $user, Comment $comment): bool
    {
        // Admin can delete any comment, others can delete their own comments
        return $user->hasRole('admin') || $comment->user_id === $user->id;
    }

    /**
     * Determine whether the user can restore a comment.
     */
    public function restore(User $user, Comment $comment): bool
    {
        // Only admins can restore comments
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can permanently delete a comment.
     */
    public function forceDelete(User $user, Comment $comment): bool
    {
        // Only admins can permanently delete comments
        return $user->hasRole('admin');
    }
}
