<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'password' => ['required', 'string'],
        ]);

        $adminEmail = config('auth.admin_email', 'admin@skshop.com');
        $admin      = User::where('email', $adminEmail)->first();

        if (!$admin || !Auth::attempt(['email' => $adminEmail, 'password' => $request->password])) {
            Log::warning('Failed admin login attempt', ['ip' => $request->ip()]);

            return response()->json([
                'success' => false,
                'message' => 'Invalid password',
                'errors'  => ['password' => ['Incorrect password']],
            ], 401);
        }

        $admin->tokens()->where('name', 'admin-token')->delete();
        $token = $admin->createToken('admin-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data'    => [
                'token' => $token,
                'user'  => [
                    'id'    => $admin->id,
                    'name'  => $admin->name,
                    'email' => $admin->email,
                ],
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
            'data'    => [],
        ]);
    }

    public function profile(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Profile fetched successfully',
            'data'    => [
                'id'    => $request->user()->id,
                'name'  => $request->user()->name,
                'email' => $request->user()->email,
            ],
        ]);
    }
}