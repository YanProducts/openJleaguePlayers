<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;


// 認証されていないユーザーの場合
Route::middleware('guest')->group(function () {

// 登録はこちら
    Route::get('register', [RegisteredUserController::class, 'create'])
    ->name('register');

// 新規登録
    Route::post('register', [RegisteredUserController::class, 'store']);


    // ログインページ表示のルート
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
    ->name('login');


    // 実際のログイン
    Route::post('login', [AuthenticatedSessionController::class, 'store'])->name('login_post_route');


    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
                ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
                ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
                ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
                ->name('password.store');
});


// 認証されているユーザーの場合
Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
                ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
                ->middleware(['signed', 'throttle:6,1'])
                ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
                ->middleware('throttle:6,1')
                ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
                ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    // ログアウト
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('logout');

});

// 共通のユーザーの作成(作成時のみ必要)
Route::get("create/commonUser",[RegisteredUserController::class,"createCommonUser"])
->name("createCommonUser");
