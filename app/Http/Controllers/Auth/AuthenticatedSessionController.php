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
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    // ログイン時(get)
    public function create(): Response
    {

        return Inertia::render('Auth/Login', [
            'status' => session('status'),
            'canResetPassword' => Route::has('password.request'),
            // 年度の設定
            "year"=>empty(session("year")) ? date("y",time()) : session("year"),
            "noLoginPass"=>env("COMMON_USER_PASS"),
            // トークンはnoCommonUser用
            "token"=>csrf_token(),
            "isLocal"=>env("APP_ENV")
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    // ログイン時にユーザー名とパスワードが合っているか確認
    public function store(LoginRequest $request): RedirectResponse
    {

        // ユーザーネームとパスワードが正しいか？
        $request->authenticate();

        // セッションIDを再生成(LoginRequestの親クラスのメソッド)
        $request->session()->regenerate();


        // redirect()->intended()はユーザーが元々アクセスしようとしていたページに戻すためのもの（途中でログインしていないから戻らされた時)。そうではなくログイン画面に直接アクセスして来た場合、RouteServiceProvider::HOMEにアクセスする（この場合はtopPage.jsx）。
        return redirect()->intended(RouteServiceProvider::HOME);
    }

    // 共通ユーザー用リクエスト（ユーザー名とパスワードが合っているか確認）
    public function login_for_common(LoginRequest $request): JsonResponse{

        // ユーザーネームとパスワードが正しいか？(commonUserもsqlで登録されている)
        $request->authenticate();

        // セッションIDを再生成(LoginRequestの親クラスのメソッド)
        $request->session()->regenerate();

        return response()->json([
            "commonUserLogin"=>true
        ]);


        // redirect()->intended()はユーザーが元々アクセスしようとしていたページに戻すためのもの（途中でログインしていないから戻らされた時)。そうではなくログイン画面に直接アクセスして来た場合、RouteServiceProvider::HOMEにアクセスする（この場合はtopPage.jsx）。
        return redirect()->intended(RouteServiceProvider::HOME);
    }










    // ログアウト
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }

}
