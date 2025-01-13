<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use App\Http\Requests\Auth\StoreUserRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

// ユーザーの登録
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
    // ユーザーの登録完了
    public function store(StoreUserRequest $request): RedirectResponse
    {

        $user = User::create([
            'name' => $request->name,
            'password' => Hash::make($request->password),
            "remember_token"=>bin2hex(random_bytes(32))
        ]);

        // メール送信の部分、今回は必要なし
        // event(new Registered($user));

        // ログイン
        Auth::login($user);

        // ホームページへ移動(HOMEはapp/Providers/RouteServiceProvider.phpで定義)
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
