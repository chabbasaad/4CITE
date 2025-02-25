<?php

namespace App\Events;

use App\Models\Post;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class NewPostCreated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;






    public $post;
    public $followers;

    public function __construct(Post $post, $followers)
    {
        $this->post = $post;
        $this->followers = $followers;
    }

    public function broadcastOn()
    {
        // Notify all followers on their private channels
        return collect($this->followers)->map(function ($follower) {
            return new PrivateChannel('user.' . $follower->id);
        })->toArray();


    }

    public function broadcastWith()
    {
        return [
            'post_id' => $this->post->id,
            'title' => $this->post->title,
            'content' => $this->post->content,
            'author_id' => $this->post->user_id,
        ];
    }
}
