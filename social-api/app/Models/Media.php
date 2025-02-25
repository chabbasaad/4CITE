<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $fillable = ['post_id', 'media_path', 'media_type'];

    // Define inverse relationship with post
    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
