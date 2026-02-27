<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->only(['name', 'email', 'username', 'password', 'password_confirmation', 'user_type']);

        $v = Validator::make($data, [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'username' => 'required|string|unique:users,username',
            'password' => [
                'required',
                'string',
                'min:8',
                'max:16',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/',
            ],
            'user_type' => 'nullable|string|in:standard,premium',
        ], [
            'password.regex' => 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        ]);

        if ($v->fails()) {
            return response()->json(['errors'=>$v->errors()], 422);
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'username' => $data['username'],
            'password' => Hash::make($data['password']),
            'user_type' => $data['user_type'] ?? 'standard',
        ]);

        return response()->json(['user'=>$user], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only(['username','password']);

        $v = Validator::make($credentials, [
            'username' => 'required',
            'password' => 'required',
        ]);

        if ($v->fails()) {
            return response()->json(['errors'=>$v->errors()], 422);
        }

        $user = User::where('username', $credentials['username'])->orWhere('email', $credentials['username'])->first();
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message'=>'Incorrect username or password'], 401);
        }

        $token = $user->createToken('api')->plainTextToken;
        return response()->json(['user'=>$user, 'token'=>$token]);
    }
}
