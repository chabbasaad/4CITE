<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Post;
use Illuminate\Support\Facades\DB;

class LikesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure we have users and posts to work with
        $users = User::all();
        $posts = Post::all();

        if ($users->isEmpty() || $posts->isEmpty()) {
            $this->command->info('No users or posts available to seed likes.');
            return;
        }

        // Seed likes with random data
        foreach ($posts as $post) {
            $likedUsers = $users->random(rand(1, $users->count()));

            foreach ($likedUsers as $user) {
                DB::table('likes')->insert([
                    'user_id' => $user->id,
                    'post_id' => $post->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('Likes table seeded successfully.');
    }
}
