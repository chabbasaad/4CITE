<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hotels', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('location');
            $table->text('description');
            $table->json('picture_list')->nullable();
            $table->decimal('price_per_night', 10, 2);
            $table->boolean('is_available')->default(true);
            $table->integer('total_rooms');
            $table->integer('available_rooms');
            $table->json('amenities')->nullable();
            $table->timestamps();

            // Add indexes for sorting and filtering
            $table->index('name');
            $table->index('location');
            $table->index('price_per_night');
            $table->index('is_available');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotels');
    }
};
