<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LikeController extends Controller
{
    /**
     * Toggle like status for a post.
     */
    public function toggle($postId)
    {
        $post = Post::findOrFail($postId);
        $userId = Auth::id();

        $isLiked = $post->likes()->where('user_id', $userId)->exists();

        if ($isLiked) {
            $post->likes()->detach($userId);
            $message = 'Post unliked successfully';
        } else {
            $post->likes()->attach($userId);
            $message = 'Post liked successfully';
        }

        return response()->json([
            'message' => $message,
            'likes_count' => $post->likes()->count(),
            'is_liked' => !$isLiked
        ]);
    }

}
