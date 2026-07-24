<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        // Find the admin user
        $admin = User::where('email', 'admin@skshop.com')->first();

        if (!$admin || !Auth::attempt(['email' => 'admin@skshop.com', 'password' => $request->password])) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid password',
                'errors' => ['password' => ['Incorrect password']]
            ], 401);
        }

        $token = $admin->createToken('admin-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'token' => $token,
                'user' => $admin
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
            'data' => []
        ]);
    }

    public function profile(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Profile fetched successfully',
            'data' => $request->user()
        ]);
    }
}
