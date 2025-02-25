<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;


class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles
        $admin = Role::create(['name' => 'admin', 'guard_name' => 'web']);
        $contentCreator = Role::create(['name' => 'content_creator', 'guard_name' => 'web']);
        $user = Role::create(['name' => 'user', 'guard_name' => 'web']);

        // Create permissions
        $manageUsers = Permission::create(['name' => 'manage users', 'guard_name' => 'web']);
        $createContent = Permission::create(['name' => 'create content', 'guard_name' => 'web']);
        $editContent = Permission::create(['name' => 'edit content', 'guard_name' => 'web']);
        $deleteContent = Permission::create(['name' => 'delete content', 'guard_name' => 'web']);
        $viewContent = Permission::create(['name' => 'view content', 'guard_name' => 'web']);
        $commentOnContent = Permission::create(['name' => 'comment on content', 'guard_name' => 'web']);

        // Assign permissions to roles
        $admin->givePermissionTo([$manageUsers, $createContent, $editContent, $deleteContent, $viewContent, $commentOnContent]);
        $contentCreator->givePermissionTo([$createContent, $editContent, $deleteContent, $viewContent]);
        $user->givePermissionTo([$viewContent, $commentOnContent]);
    }
}
