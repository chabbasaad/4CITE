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
        'total_price',
        'payment_status',
        'payment_method',
        'transaction_id',
        'paid_at'
    ];

    protected $casts = [
        'check_in_date' => 'datetime',
        'check_out_date' => 'datetime',
        'guests_count' => 'integer',
        'guest_names' => 'array',
        'total_price' => 'float',
        'paid_at' => 'datetime'
    ];

    protected static function booted()
    {
        static::creating(function ($booking) {
            $booking->guests_count = count($booking->guest_names ?? []);
            if (!isset($booking->total_price)) {
                $booking->calculateTotalPrice();
            }
            $booking->payment_status = 'pending';
        });

        static::updating(function ($booking) {
            if ($booking->isDirty('guest_names')) {
                $booking->guests_count = count($booking->guest_names ?? []);
            }
            if ($booking->isDirty(['check_in_date', 'check_out_date']) && !$booking->isDirty('total_price')) {
                $booking->calculateTotalPrice();
            }
        });
    }

    public function calculateTotalPrice()
    {
        $checkIn = Carbon::parse($this->check_in_date);
        $checkOut = Carbon::parse($this->check_out_date);
        $nights = $checkOut->diffInDays($checkIn);
        $this->total_price = $this->hotel->price_per_night * max(1, $nights);
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

    // Payment-related methods
    public function isPaid(): bool
    {
        return $this->payment_status === 'completed' &&
               $this->paid_at !== null &&
               $this->transaction_id !== null &&
               $this->payment_method !== null;
    }

    public function canProcessPayment(User $user): bool
    {
        return ($user->isStaff() || $this->user_id === $user->id) && !$this->isPaid();
    }

    public function markAsPaid(string $paymentMethod, string $transactionId): void
    {
        $this->update([
            'status' => 'paid',
            'payment_status' => 'completed',
            'payment_method' => $paymentMethod,
            'transaction_id' => $transactionId,
            'paid_at' => now()
        ]);
    }

    public function generateTransactionId(): string
    {
        return 'TRX-' . time() . '-' . $this->id;
    }

    public function getPaymentAmount(): float
    {
        return (float) $this->total_price;
    }

    public function getPaymentValidationRules(): array
    {
        return [
            'payment_method' => 'required|string|in:credit_card,debit_card,paypal',
            'card_number' => 'required_if:payment_method,credit_card,debit_card|string|size:16',
            'expiry_date' => 'required_if:payment_method,credit_card,debit_card|string|size:5',
            'cvv' => 'required_if:payment_method,credit_card,debit_card|string|size:3',
        ];
    }
}
