<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Gate;

class UserController extends Controller
{
     /**
     * Display a listing of all users (Admin only).
     */
    public function index()
    {
      //  Gate::authorize('viewAny', User::class);

        $users = User::with('roles')->get();

        return response()->json($users, 200);
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|string|in:admin,content_creator,user',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        $user->assignRole($validated['role']);

        // Optionally, send a verification email
        $user->sendEmailVerificationNotification();

        return response()->json(['message' => 'User created successfully.', 'user' => $user], 201);
    }

    /**
     * Display the specified user (Admin or Self).
     */
    public function show($id)
    {
        $user = User::findOrFail($id);

     //   Gate::authorize('view', $user);

        return response()->json($user, 200);
    }

    public function showPublicProfile(Request $request, $id)
    {
        $authUser = $request->user();

        $user = User::with(['posts' => function ($query) {
            $query->with(['comments.user', 'media', 'likes']);
        }])->findOrFail($id);

        // Check if the requesting user is NOT the owner of the profile
        if ($authUser->id !== $user->id && $user->profile_type === 'private') {
            return response()->json(['message' => 'This profile is private.'], 403);
        }

        // Determine if the authenticated user is following this profile user
        $isFollowing = $authUser ? $authUser->isFollowing($user->id) : false;

        $posts = $user->posts->map(function ($post) use ($authUser) {
            return [
                'id' => $post->id,
                'title' => $post->title,
                'content' => $post->content,
                'likes_count' => $post->likes->count(),
                'media' => $post->media->map(function ($media) {
                    return [
                        'id' => $media->id,
                        'media_path' => $media->media_path,
                        'media_type' => $media->media_type,
                    ];
                }),
                'created_at' => $post->created_at,
                'user' => [
                    'id' => $post->user->id,
                    'name' => $post->user->name,
                    'is_following' => $authUser
                        ? $authUser->isFollowing($post->user->id)
                        : false,
                ],
                'comments' => $post->comments->map(function ($comment) use ($authUser) {
                    return [
                        'id' => $comment->id,
                        'content' => $comment->content,
                        'user' => [
                            'id' => $comment->user->id,
                            'name' => $comment->user->name,
                            'is_following' => $authUser
                                ? $authUser->isFollowing($comment->user->id)
                                : false,
                        ],
                        'created_at' => $comment->created_at,
                    ];
                }),
            ];
        });

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'profile_type' => $user->profile_type,
            'role' => $user->role,
            'is_following' => $isFollowing,
            'posts_count' => $user->posts->count(),
            'followers_count' => $user->followers()->count(),
            'following_count' => $user->following()->count(),
            'posts' => $posts,
        ]);
    }

    public function showProfileOfLoggedUser(Request $request)
    {
        $user = $request->user();

        $userWithPosts = User::with(['posts' => function ($query) {
            $query->with(['comments.user']); // Include comments and the users who created them
        }])->findOrFail($user->id);

        // Return user details with posts and comments
        return response()->json([
            'id' => $userWithPosts->id,
            'name' => $userWithPosts->name,
            'email' => $userWithPosts->email,
            'profile_type' => $userWithPosts->profile_type,
            'role' => $userWithPosts->role,
            'posts' => $userWithPosts->posts->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'content' => $post->content,
                    'image_path' => $post->image_path,
                    'video_path' => $post->video_path,
                    'created_at' => $post->created_at,
                    'comments' => $post->comments->map(function ($comment) {
                        return [
                            'id' => $comment->id,
                            'content' => $comment->content,
                            'user' => [
                                'id' => $comment->user->id,
                                'name' => $comment->user->name,
                            ],
                            'created_at' => $comment->created_at,
                        ];
                    }),
                ];
            }),
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

      //  Gate::authorize('update', $user);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:6|confirmed',
            'role' => 'sometimes|string|in:admin,content_creator,user',
        ]);

        $user->update([
            'name' => $validated['name'] ?? $user->name,
            'email' => $validated['email'] ?? $user->email,
            'password' => isset($validated['password']) ? Hash::make($validated['password']) : $user->password,
        ]);

        if (isset($validated['role'])) {
            $user->syncRoles([$validated['role']]);
        }

        return response()->json(['message' => 'User updated successfully.', 'user' => $user], 200);
    }

    /**
     * Remove the specified user.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

       // Gate::authorize('delete', $user);

        $user->delete();

        return response()->json(['message' => 'User deleted successfully.'], 200);
    }

    /**
     * Restore a soft-deleted user.
     */
    public function restore($id)
    {
        $user = User::withTrashed()->findOrFail($id);

        //Gate::authorize('restore', $user);

        $user->restore();

        return response()->json(['message' => 'User restored successfully.'], 200);
    }

    /**
     * View soft-deleted users (Admin only).
     */
    public function trashed()
    {
        //Gate::authorize('viewTrashed', User::class);

        $users = User::onlyTrashed()->get();

        return response()->json($users, 200);
    }

        /**
     * Toggle the user's profile type between 'public' and 'private'.
     */
    public function toggleProfileType(Request $request)
    {
        $user = $request->user(); // Get the currently authenticated user

        // Toggle the profile type
        $user->profile_type = $user->profile_type === 'public' ? 'private' : 'public';
        $user->save();

        return response()->json([
            'message' => 'Profile type updated successfully.',
            'profile_type' => $user->profile_type,
        ], 200);
    }
}
