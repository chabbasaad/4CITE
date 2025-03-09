<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Hotel extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'location',
        'description',
        'price_per_night',
        'available_rooms',
        'is_available',
        'total_rooms',
        'amenities',
        'picture_list',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price_per_night' => 'float',
        'available_rooms' => 'integer',
        'total_rooms' => 'integer',
        'is_available' => 'boolean',
        'amenities' => 'array',
        'picture_list' => 'array',
    ];

    /**
     * Get the bookings for the hotel.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Scope a query to only include available hotels.
     */
    public function scopeAvailable($query, bool $available = true)
    {
        return $query->where('is_available', $available);
    }

    /**
     * Scope a query to filter by price range.
     */
    public function scopePriceRange($query, ?float $min = null, ?float $max = null)
    {
        if ($min !== null) {
            $query->where('price_per_night', '>=', $min);
        }
        if ($max !== null) {
            $query->where('price_per_night', '<=', $max);
        }

        return $query;
    }

    /**
     * Scope a query to search hotels.
     */
    public function scopeSearch($query, ?string $search)
    {
        if ($search) {
            return $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return $query;
    }
}
