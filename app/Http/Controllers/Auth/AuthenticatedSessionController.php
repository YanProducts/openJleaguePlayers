<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {

        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    // パスワードが合っているか確認
    public function store(LoginRequest $request): RedirectResponse
    {

        $request->authenticate();

        $request->session()->regenerate();

        // App\Providers\RouteServiceProviderに表示
        return redirect()->intended(RouteServiceProvider::HOME);
    }

    // ログアウト
    public function destroy(Request $request): RedirectResponse
    {
        // dd("yy");
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }

    // ログインせずに遊ぶ
    public function noLoginPlaying(){

        // まだ作成されていない時は作成
        $this->createCommonUser();

        // 共通のユーザーネームでログイン
        $this->loginCommonUser();


        //ページ遷移
        return Inertia::render("topPage");
    }

    // 共通のユーザーの作成
    public function createCommonUser(){

    }

    // 共通のユーザーでログイン
    public function loginCommonUser(){

    }
}
