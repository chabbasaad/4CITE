<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'hotel_id',
        'check_in_date',
        'check_out_date',
        'guests_count',
        'guest_names',
        'status',
        'special_requests',
        'contact_phone',
        'total_price'
    ];

    protected $casts = [
        'check_in_date' => 'datetime',
        'check_out_date' => 'datetime',
        'guests_count' => 'integer',
        'guest_names' => 'array',
        'total_price' => 'float',
    ];

    protected static function booted()
    {
        static::creating(function ($booking) {
            $booking->guests_count = count($booking->guest_names ?? []);
            $booking->calculateTotalPrice();
        });

        static::updating(function ($booking) {
            if ($booking->isDirty('guest_names')) {
                $booking->guests_count = count($booking->guest_names ?? []);
            }
            if ($booking->isDirty(['check_in_date', 'check_out_date'])) {
                $booking->calculateTotalPrice();
            }
        });
    }

    public function calculateTotalPrice()
    {
        $nights = $this->check_in_date->diffInDays($this->check_out_date);
        $this->total_price = $this->hotel->price_per_night * $nights;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }

    public function canBeCancelled()
    {
        $now = Carbon::now();
        $hoursUntilCheckIn = $now->diffInHours($this->check_in_date, false);
        return $hoursUntilCheckIn >= 48;
    }

    public function canBeCancelledByUser(User $user)
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $this->user_id === $user->id && $this->canBeCancelled();
    }

    public function canBeAccessedByUser(User $user)
    {
        return $user->isAdmin() || $user->isEmployee() || $this->user_id === $user->id;
    }

    public function scopeForUser($query, User $user)
    {
        if ($user->isAdmin() || $user->isEmployee()) {
            return $query;
        }

        return $query->where('user_id', $user->id);
    }
}
