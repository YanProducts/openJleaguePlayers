<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ConfigController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\BeforeGameController;
use App\Http\Controllers\ShowResultController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StaticValueController;
use Illuminate\Support\Facades\Log;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::middleware(['web', 'auth'])->group(function () {
Route::middleware(['web'])->group(function () {
    // ここにルート定義

    Route::get('/', function () {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    });

    // ログイン認証
    // Route::middleware('auth')->group(function () {
    //     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    //     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    //     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    // });

    // トップページ
    Route::get('/topPage', [BeforeGameController::class,"show_top_page"])
    // auth.user()が設定されていない時は、localStorageから参照
    ->name('topPage');

    // マイページへ
    Route::get('/myPage', [ShowResultController::class,"show_my_page"])
    ->middleware(['auth'])
    ->name('myPage');

    // マイページのデータの取得
    Route::post("/fetchMyData",[ShowResultController::class,"fetch_my_data"])
    ->middleware(['auth'])
    ->name("fetchMyData");

    // ゲーム種類決定
    Route::post("/game.decide_pattern",[BeforeGameController::class,"decide_game_pattern"])
    ->name("decideGamePattern");

    // ゲーム開始
    Route::get("/game.play",[BeforeGameController::class,"to_game_page_view"])
    ->middleware(['auth'])
    ->name("play_game");

    // 回答があっているか？
    Route::post("/game/answerCheck",[GameController::class,"answer_check"])
    ->middleware(['auth'])
    ->name("answerCheck");

    //お知らせ
    Route::get('/sign', function () {
        return Inertia::render('Sign',[
            "message"=>session("message")
        ]);
    })->middleware(['auth'])->name('view_sign_page');

    // ゲームクリアのルート
    Route::get("/game.clear",[GameController::class,"game_clear"])
    ->middleware(['auth'])
    ->name("gameClear");


    // 以下config用
    // 選手名とチーム名の登録(年度変更)
    Route::get("/update_data",[ConfigController::class,"update_newYear_data"])
    ->name("dataChange_newYear");

    // エラーがあった時のビュー
    Route::get("/error_view",function(){

        // クエリパラメータ 'message' を取得
        $message = request()->query('message', 'unExpected');

        // // ビューの表示
            return Inertia::render('Error/Custom',[
                "message"=>$message ?? "unExpected",
                "top_page"=>route("topPage"),
                "isLocal"=>env("APP_ENV")
            ])->toResponse(request())->setStatusCode(500);
    })->name("error_view");


    // ログイン操作
    require __DIR__.'/auth.php';

});
