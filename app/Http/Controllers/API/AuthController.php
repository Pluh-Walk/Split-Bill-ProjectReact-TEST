<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Invitation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeEmail;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->only(['first_name','last_name','nickname','email','username','password','password_confirmation']);

        $v = Validator::make($data, [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'nickname' => 'required|string|max:255|unique:users,nickname',
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
        ], [
            'password.regex' => 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        ]);

        if ($v->fails()) {
            return response()->json(['errors'=>$v->errors()], 422);
        }

        $user = User::create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'nickname' => $data['nickname'],
            'email' => $data['email'],
            'username' => $data['username'],
            'password' => Hash::make($data['password']),
        ]);

        // Send welcome email
        Mail::to($user->email)->send(new WelcomeEmail($user));

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

    public function inviteGuest(Request $request)
    {
        $v = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);
        if ($v->fails()) return response()->json(['errors'=>$v->errors()], 422);

        $code = Str::upper(Str::random(8));
        $inv = Invitation::create([
            'code'=>$code,
            'inviter_id'=>$request->user()->id,
            'invitee_email'=>$request->email,
            'expires_at'=>now()->addDays(7),
        ]);

        return response()->json(['invitation'=>$inv]);
    }

    public function upgradeGuest(Request $request)
    {
        $v = Validator::make($request->all(), [
            'password' => ['required','string','min:8','max:16','confirmed'],
        ]);
        if ($v->fails()) return response()->json(['errors'=>$v->errors()], 422);

        $user = $request->user();
        $user->password = Hash::make($request->password);
        $user->is_guest = false;
        $user->save();

        return response()->json(['user'=>$user]);
    }
}
