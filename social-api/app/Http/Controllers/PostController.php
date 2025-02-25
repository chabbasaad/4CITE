<?php
namespace App\Http\Controllers;


use App\Models\Post;
use App\Models\User;
use App\Models\Follow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;


class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Get the authenticated user
        $authUser = $request->user();

        // Get posts with relationships
        $posts = Post::with(['user', 'comments.user', 'media', 'likes'])
            ->get()
            ->map(function ($post) use ($authUser) {
                // Add 'is_following' to the user object
                $post->user->is_following = $authUser
                    ? $authUser->following()->where('following_id', $post->user->id)->exists()
                    : false;

                // Add 'is_following' to comment users
                $post->comments->each(function ($comment) use ($authUser) {
                    $comment->user->is_following = $authUser
                        ? $authUser->following()->where('following_id', $comment->user->id)->exists()
                        : false;
                });

                // Add 'likes_count' to the post
                $post->likes_count = $post->likes->count();

                // Add the complete URL to media items
                $post->media->each(function ($media) {
                    $media->media_url = env('AZURE_STORAGE_URL') . '/' . $media->media_path;
                });

                return $post;
            });

        return response()->json($posts, 200);
    }


    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required',
            'media.*' => 'nullable|file|mimes:jpg,jpeg,png,gif,mp4,avi,mov,mkv|max:102400', // Allow images and videos up to 100MB
        ]);

        // Create the post
        $post = Post::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'content' => $validated['content'],
        ]);


        // Handle media uploads
        if ($request->hasFile('media')) {
            foreach ($request->file('media') as $media) {
                // Sanitize filename: remove spaces and special characters
                $originalFileName = time() . '_' . preg_replace('/[^A-Za-z0-9\-\_\.]/', '_', $media->getClientOriginalName());
                $disk = Storage::disk('azure');

                // Save the original file (image or video) to Azure Blob Storage
                $disk->put($originalFileName, file_get_contents($media));

                // Save media details in the database
                $post->media()->create([
                    'media_path' => $originalFileName,
                    'media_type' => $media->getMimeType(),
                ]);
            }
        }

        return response()->json($post->load('media'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        return $post->load('media');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        $validatedData = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
        ]);

        // Update the fields that are provided in the request
        if (!empty($validatedData['title'])) {
            $post->title = $validatedData['title'];
        }
        if (!empty($validatedData['content'])) {
            $post->content = $validatedData['content'];
        }

        // Save the updated post
        $post->save();

        return response()->json($post, 200);
    }

    public function destroy(Post $post)
    {
        Gate::authorize('delete', $post);

        foreach ($post->media as $media) {
            Storage::disk('azure')->delete($media->media_path); // Delete from Azure
            $media->delete(); // Delete database record
        }

        $post->delete();

        return response()->json(['message' => 'Post and associated media deleted']);
    }

        /**
         * Display soft-deleted resources.
         */
        public function trashed()
        {
            return Post::onlyTrashed()->get();
        }

        /**
         * Restore a soft-deleted resource.
         */
        public function restore($id)
        {
            $post = Post::withTrashed()->findOrFail($id);
            $post->restore();

            return response()->json(['message' => 'Post restored']);
        }


        public function getUserPosts($userId)
        {
            // Check if the user exists
            $user = User::findOrFail($userId);

            // Retrieve all posts for the user
            $posts = Post::where('user_id', $userId)
                ->with('user') // Optionally include the user details
                ->get();

            // Check if the user has posts
            if ($posts->isEmpty()) {
                return response()->json(['message' => 'No posts found for this user.'], 404);
            }

            // Return the user's posts
            return response()->json(['posts' => $posts], 200);
        }


    // store and index and delete for local storage only

    /**
     * Remove the specified resource from storage.
     */
    // public function destroy(Post $post)
    // {

    //    Gate::authorize('delete', $post);
    //     // Delete associated media files
    //     foreach ($post->media as $media) {
    //         Storage::disk('public')->delete($media->media_path);
    //         $media->delete();
    //     }

    // // Delete the post
    // $post->delete();

    // return response()->json(['message' => 'Post and associated media deleted']);
    // }

        /**
     * Store a newly created resource in storage.
     */
    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'title' => 'required|string|max:255',
    //         'content' => 'required',
    //         'media.*' => 'nullable|file|max:2048', // Allow multiple files
    //     ]);

    //     // Create the post
    //     $post = Post::create([
    //         'user_id' => $request->user()->id,
    //         'title' => $validated['title'],
    //         'content' => $validated['content'],
    //     ]);

    //     // Handle media uploads
    //     if ($request->hasFile('media')) {
    //         foreach ($request->file('media') as $media) {
    //             $mediaPath = $media->store('media', 'public');
    //             $mediaType = $media->getMimeType(); // Get file type

    //             // Save media to database
    //             $post->media()->create([
    //                 'media_path' => $mediaPath,
    //                 'media_type' => $mediaType,
    //             ]);
    //         }
    //     }


    //     return response()->json($post->load('media'), 201);

    // }

     // public function index(Request $request)
    // {
    //     // Check if the user has permission to view posts
    //  //   Gate::authorize('viewAny', Post::class);

    //  $authUser = $request->user(); // Get the currently authenticated user

    //  $posts = Post::with(['user', 'comments.user', 'media', 'likes'])
    //      ->get()
    //      ->map(function ($post) use ($authUser) {
    //          // Add 'is_following' to the user object
    //          $post->user->is_following = $authUser
    //              ? $authUser->following()->where('following_id', $post->user->id)->exists()
    //              : false;

    //          // Add 'is_following' to comment users
    //          $post->comments->each(function ($comment) use ($authUser) {
    //              $comment->user->is_following = $authUser
    //                  ? $authUser->following()->where('following_id', $comment->user->id)->exists()
    //                  : false;
    //          });

    //          // Add 'likes_count' to the post
    //          $post->likes_count = $post->likes->count();



    //          return $post;
    //      });




    //  return response()->json($posts, 200);
    // }



}



