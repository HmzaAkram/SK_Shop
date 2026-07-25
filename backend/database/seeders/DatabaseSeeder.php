<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $adminEmail = config('auth.admin_email', 'admin@skshop.com');

        User::updateOrCreate(
            ['email' => $adminEmail],
            [
                'name'     => 'Admin',
                'password' => Hash::make(env('ADMIN_PASSWORD', '0300')),
            ]
        );
    }
}