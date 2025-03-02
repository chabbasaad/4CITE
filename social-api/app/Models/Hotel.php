<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'description',
        'location',
        'price_per_night',
        'is_available',
        'amenities',
        'total_rooms'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amenities' => 'array',
        'is_available' => 'boolean',
        'price_per_night' => 'decimal:2'
    ];

    /**
     * Get the bookings for the hotel.
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Scope a query to only include available hotels.
     */
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    /**
     * Scope a query to sort hotels by various criteria.
     */
    public function scopeSort($query, $sortBy = 'created_at', $direction = 'desc')
    {
        $allowedSortFields = ['name', 'location', 'price_per_night', 'created_at'];

        if (in_array($sortBy, $allowedSortFields)) {
            return $query->orderBy($sortBy, $direction === 'asc' ? 'asc' : 'desc');
        }

        return $query->orderBy('created_at', 'desc');
    }
}
