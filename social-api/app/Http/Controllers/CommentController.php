<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {

        return response()->json(
            Comment::with(['user', 'post'])->get()
        );
    }

    /**
     * Store a newly created comment in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {

        $validated = $request->validate([
            'post_id' => 'required|exists:posts,id',
            'content' => 'required|string',
        ]);

        $comment = Comment::create([
            'user_id' => $request->user()->id,
            'post_id' => $validated['post_id'],
            'content' => $validated['content'],
        ]);

        return response()->json($comment, 201);
    }

    /**
     * Display the specified comment.
     *
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Comment $comment)
    {

        return response()->json(
            $comment->load(['user', 'post'])
        );
    }

    /**
     * Update the specified comment in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Comment $comment)
    {


        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $comment->update(['content' => $validated['content']]);

        return response()->json($comment);
    }

    /**
     * Remove the specified comment from storage.
     *
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Comment $comment)
    {


        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted'
        ]);
    }

    /**
     * Fetch all comments for a specific post.
     *
     * @param  int  $postId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCommentsByPost($postId)
    {
        $post = Post::findOrFail($postId);

        $comments = $post->comments()
            ->with('user')
            ->get();

        return response()->json($comments);
    }

    /**
     * Display a list of soft-deleted comments.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function trashed()
    {

        return response()->json(
            Comment::onlyTrashed()->get()
        );
    }

    /**
     * Restore a soft-deleted comment.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function restore($id)
    {
        $comment = Comment::withTrashed()->findOrFail($id);

        $comment->restore();

        return response()->json([
            'message' => 'Comment restored'
        ]);
    }
}
