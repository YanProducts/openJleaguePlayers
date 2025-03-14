<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\UpdateAuthInfoController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\RememberController;
use App\Http\Requests\Auth\UpdateAuthInfoRequest;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


// CSRF処理はwebミドルウェアに含まれる
Route::middleware(['web'])->group(function () {

    // auth.loginがなされているかいないかで処理を変更する

   // 登録はこちら
    Route::get('register', [RegisteredUserController::class, 'create'])
    ->name('register');

   // 新規登録
    Route::post('register', [RegisteredUserController::class, 'store']);

    // ログインページ表示のルート(念の為ログイン時にはログアウトへリダイレクト)
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])
    ->name('login');

    // // 実際のログイン(共有ユーザー以外)
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login_post_route');

    // 共有ユーザー用のログイン
    Route::post('/login_for_common', [AuthenticatedSessionController::class, 'login_for_common'])->name('login_post_route_for_common');

    // 登録内容変更のビュー
    Route::get('auth/change-data', [UpdateAuthInfoController::class,"viewUpdateAuthInfoTop"])
    ->middleware(["auth"])
    ->name("viewUpdateAuthInfo");

    // 登録内容変更決定
    Route::post('auth/change-data-decide', [UpdateAuthInfoController::class, 'decideUpdateWhichAuth'])
    ->name("updateAuthInfoDecide");

    // ユーザー名変更ページ
    Route::get('reset-userName/', [UpdateAuthInfoController::class, 'viewUpdateUserNamePage'])
    ->middleware(["auth"])
    ->name('username_reset');

    // パスワード変更ページ
    Route::get('reset-password', [UpdateAuthInfoController::class, 'viewUpdatePassWordPage'])
    ->middleware(["auth"])
    ->name('password_reset');

    // ユーザーネーム/パスワードのルーティングチェック
    Route::post("routeCheckForDataChange",[UpdateAuthInfoController::class,"routeCheck"])
    ->name("routeCheck_route");

    // ユーザーネーム変更投稿
    Route::post('reset-username', [UpdateAuthInfoController::class, 'storeUpdateUserName'])
    ->name("username_update_store");

    // パスワード変更投稿
    Route::post('reset-password', [UpdateAuthInfoController::class, 'storeUpdatePassWord'])
    ->name('password_update_store');

    // オートログインのチェック
    Route::post("/autoLogin",[AuthenticatedSessionController::class,"autoLogin"])
    ->name("autoLogin");


    // ログアウト
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('logout');

    // 共通のユーザーの作成(作成時のみ必要)
    // Route::get("create/commonUser",[RegisteredUserController::class,"createCommonUser"])
    // ->name("createCommonUser");

});








