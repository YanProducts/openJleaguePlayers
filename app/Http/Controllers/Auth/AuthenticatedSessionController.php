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
use App\Models\User;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    // ログイン時(get)
    public function create(): Response
    {

        // もしログインしていたら、ログアウト
        if(Auth::check()){

            Log::info(Auth::user());

            return Inertia::render("Auth/AutoLogout",[
                "isLocal"=>env("APP_ENV")
            ]);
        }

        return Inertia::render('Auth/Login', [
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


        // ユーザーネームとパスワードが正しいか？=正しければAuthを付与
        $request->authenticate();

        // セッションIDを再生成(LoginRequestの親クラスのメソッド)
        $request->session()->regenerate();

        // // autologinから来たときは問答無用でトップへ

            // ページ表示
            return redirect()->route('topPage',[
                "remember"=>$request->remember ? "yes" : "no",
            ]);

        // rememberTokenの変更は、いろいろな処理を統合させるため、BeforeGameControllerに統合

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

        Log::info("ログアウトのボタンが押されました");

        // ユーザーのセッション破棄。クッキー情報もクリア。
        // Auth::user() は空（null）に
        // remember_tokenもここで変更される
        Auth::guard('web')->logout();

        // リクエストのsessionは自動的に管理されている
        // 現在のセッションIDを破棄。セッションデータ（保存されていた情報）もすべてクリア。
        $request->session()->invalidate();

        // csrfTokenの再生成
        $request->session()->regenerateToken();

        // ログインページに手動で入ったとき
        if($request->has("fromURL") && $request->fromURL==="AutoLogout"){
            return response()->json(["isOK"=>true]);
        }

        // ブルリロード
        return Inertia::location('/login');
    }

}
