<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;
use Exception;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * Available user roles
     */
    const ROLE_USER = 'user';
    const ROLE_EMPLOYEE = 'employee';
    const ROLE_ADMIN = 'admin';

    const MAX_LOGIN_ATTEMPTS = 3;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'pseudo',
        'role',
        'login_attempts',
        'locked_at',
        'is_active'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'password' => 'hashed',
        'is_active' => 'boolean',
        'locked_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($user) {
            // Delete associated tokens
            $user->tokens()->delete();

            // Check if this is the last admin
            if ($user->isAdmin()) {
                $adminCount = self::where('role', self::ROLE_ADMIN)->count();
                if ($adminCount <= 1) {
                    throw new Exception('Cannot delete the last admin user');
                }
            }
        });
    }

    /**
     * Get all available roles.
     *
     * @return array
     */
    public static function getAvailableRoles(): array
    {
        return [
            self::ROLE_USER,
            self::ROLE_EMPLOYEE,
            self::ROLE_ADMIN
        ];
    }

    /**
     * Get the bookings for the user.
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Check if the user is an admin.
     *
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    /**
     * Check if the user is an employee.
     *
     * @return bool
     */
    public function isEmployee(): bool
    {
        return $this->role === self::ROLE_EMPLOYEE;
    }

    /**
     * Check if the user is a regular user.
     *
     * @return bool
     */
    public function isUser(): bool
    {
        return $this->role === self::ROLE_USER;
    }

    /**
     * Check if user has staff privileges (admin or employee).
     *
     * @return bool
     */
    public function isStaff(): bool
    {
        return $this->isAdmin() || $this->isEmployee();
    }

    /**
     * Check if the account is locked.
     */
    public function isLocked(): bool
    {
        return $this->locked_at !== null;
    }

    /**
     * Increment login attempts and lock account if necessary.
     */
    public function incrementLoginAttempts(): void
    {
        $this->increment('login_attempts');

        if ($this->login_attempts >= self::MAX_LOGIN_ATTEMPTS) {
            $this->locked_at = now();
            $this->save();
        }
    }

    /**
     * Reset login attempts.
     */
    public function resetLoginAttempts(): void
    {
        $this->login_attempts = 0;
        $this->locked_at = null;
        $this->save();
    }

    /**
     * Set the user's email, automatically trimming whitespace.
     *
     * @param string $value
     * @return void
     */
    public function setEmailAttribute($value)
    {
        $this->attributes['email'] = strtolower(trim($value));
    }

    /**
     * Set the user's role, enforcing case sensitivity.
     *
     * @param string $value
     * @return void
     * @throws \InvalidArgumentException
     */
    public function setRoleAttribute($value)
    {
        if (!in_array($value, self::getAvailableRoles(), true)) {
            throw new \InvalidArgumentException('Role must be one of: ' . implode(', ', self::getAvailableRoles()));
        }
        $this->attributes['role'] = $value;
    }
}
