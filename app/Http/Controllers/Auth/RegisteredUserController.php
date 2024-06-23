<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use App\Rules\noGuestRule;
use App\Rules\noCommonUserRule;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required','string','max:100',"min:3",'unique:'.User::class,
            new noCommonUserRule,new noGuestRule],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ],[
            "name.required"=>"ユーザー名は必ず記入してください",
            "name.unique"=>"そのユーザー名は既に使用されています",
            "name:min"=>"ユーザー名は3字以上にしてください",
            "name:max"=>"ユーザー名は100字以内にしてください",
            "password.required"=>"パスワードは必ず入力してください",
            "password.confirmed"=>"パスワードが一致しません"
        ]);

        $user = User::create([
            'name' => $request->name,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(RouteServiceProvider::HOME);
    }

    // 共通のユーザーの作成
    static public function createCommonUser(){
        // 存在していない時のみ作成
        if(!User::where("name","commonUser")->exists()){
            User::create([
                'name' => "commonUser",
                'password' => Hash::make(env("COMMON_USER_PASS")),
            ]);
        }
    }
}
