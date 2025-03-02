<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\AdminCreateUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * List all users with pagination and filters.
     *
     * @param Request $request
     * @return JsonResponse
     *
     * Permissions:
     * - Only accessible by admins and employees
     * - Normal users can't read other users' information
     *
     * Features:
     * - Search by name, email, or pseudo
     * - Filter by role
     * - Paginated results (default 10 per page)
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        // Normal users cannot list other users
        if (!$user->isAdmin() && !$user->isEmployee()) {
            return response()->json(['message' => 'Unauthorized. Only admins and employees can list users.'], 403);
        }

        $users = User::query()
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('pseudo', 'like', "%{$search}%");
                });
            })
            ->when($request->role, function ($query, $role) {
                $query->where('role', $role);
            })
            ->paginate($request->per_page ?? 10);

        return response()->json(['data' => $users->items()]);
    }

    /**
     * Create a new user.
     *
     * Access levels:
     * - Employee: Can create 'user' role only
     * - Admin: Can create any role (user, employee, admin)
     *
     * @param AdminCreateUserRequest $request
     * @return JsonResponse
     */
    public function store(AdminCreateUserRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Hash the password
        $validated['password'] = Hash::make($validated['password']);

        // If employee, force 'user' role
        if ($request->user()->isEmployee()) {
            $validated['role'] = 'user';
        }

        // Create user
        $user = User::create($validated);

        // Mark email as verified since this is an admin/employee creating the account
        $user->markEmailAsVerified();

        return response()->json([
            'message' => 'User created successfully.',
            'data' => $user
        ], 201);
    }

    /**
     * Show details of a specific user.
     *
     * @param Request $request
     * @param User $user
     * @return JsonResponse
     *
     * Permissions:
     * - Users can only view their own profile
     * - Admins and employees can view any profile
     * - Normal users cannot read other users' information
     */
    public function show(Request $request, User $user): JsonResponse
    {
        $currentUser = $request->user();

        // Users can only view their own profile unless they're admin/employee
        if (!$currentUser->isAdmin() &&
            !$currentUser->isEmployee() &&
            $currentUser->id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized. You can only view your own profile.'
            ], 403);
        }

        return response()->json(['data' => $user]);
    }

    /**
     * Update a user's profile.
     *
     * @param UpdateUserRequest $request
     * @param User $user
     * @return JsonResponse
     *
     * Permissions:
     * - Users can only update their own profile
     * - Admins can update any profile
     * - Other users cannot update someone else's profile
     */
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $currentUser = $request->user();

        // Only allow self-update or admin update
        if (!$currentUser->isAdmin() && $currentUser->id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized. You can only update your own profile.'
            ], 403);
        }

        $validated = $request->validated();

        // Only admins can change roles
        if (isset($validated['role']) && !$currentUser->isAdmin()) {
            unset($validated['role']);
        }

        // Hash password if it's being updated
        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'User updated successfully',
            'data' => $user
        ]);
    }

    /**
     * Delete a user account.
     *
     * @param Request $request
     * @param User $user
     * @return JsonResponse
     *
     * Permissions:
     * - Users can only delete their own account
     * - Admins can delete any account
     * - Cannot delete the last admin user
     * - Other users cannot delete someone else's account
     */
    public function destroy(Request $request, User $user): JsonResponse
    {
        $currentUser = $request->user();

        // Users can only delete themselves unless they're admin
        if (!$currentUser->isAdmin() && $currentUser->id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized. You can only delete your own account.'
            ], 403);
        }

        // Prevent deleting the last admin
        if ($user->isAdmin() && User::where('role', 'admin')->count() === 1) {
            return response()->json([
                'message' => 'Cannot delete the last admin user'
            ], 400);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }
}
