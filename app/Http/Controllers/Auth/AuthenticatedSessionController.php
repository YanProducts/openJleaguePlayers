<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Controllers\SessionController;
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
use App\Http\Controllers\StaticValueController;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    // ログイン時(get)
    public function create(): Response
    {
;
        // もしログインしていたら、ログアウト
        if(Auth::check()){
            return Inertia::render("Auth/AutoLogout",[
                "isLocal"=>env("APP_ENV")
            ]);
        }

        return Inertia::render('Auth/Login', [
            // 'status' => session('status'),
            // 年度の設定
            "year"=>empty(session("year")) ? date("y",time()) : session("year"),
            "noLoginPass"=>env("COMMON_USER_PASS"),
            "isLocal"=>env("APP_ENV")
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    // ログイン時にユーザー名とパスワードが合っているか確認
    // 通常のログインとautoLoginの両方がここ
    public function store(LoginRequest $request)
    {

        // ユーザーネームとパスワードが正しいか？
        $request->authenticate();

        // セッションIDを再生成(LoginRequestの親クラスのメソッド)
        $request->session()->regenerate();


        if($request?->fromURL==="autoLogin"){
            // ページ表示
            return redirect()->route('topPage');
        }


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




    // ログアウト(手動と自動両方ここ)
    public function destroy(Request $request)
    {

        // ユーザーのセッション破棄。クッキー情報もクリア。
        // Auth::user() は空（null）に
        Auth::guard('web')->logout();

        // リクエストページのsessionは自動的に管理されている
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // 自動ログインの際
        if($request->has("fromURL") && $request->fromURL==="AutoLogout"){
            return response()->json(["isOK"=>true]);
        }

        return redirect('/');
    }

}
