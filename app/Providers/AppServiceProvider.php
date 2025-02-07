<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
        // @ts-ignore
        Password::defaults(
        function(){
        return   Password::min(8)
        ->max(255)
        ->mixedCase() // 大文字と小文字のアルファベットを含むこと
        ->symbols() // 記号を1文字以上含むこと
        ->numbers() // 数字を1文字以上含むこと
        ->uncompromised(); // 漏洩済みパスワードでないこと
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // breeze初期設定はDepricatedを削除したままで自分のコードでは Deprecated を表示
        error_reporting(E_ALL);

    }
}
