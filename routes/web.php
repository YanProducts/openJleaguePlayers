<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ConfigController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\BeforeGameController;
use App\Http\Controllers\ShowResultController;
use Illuminate\Support\Facades\Auth;
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
    Route::get('/test-cookie', function () {
        return response('Cookie set')->cookie('test_cookie', '12345', 60);
    });


    // Homeルート(ログインによって変更)
    Route::get('/', function () {
        return Inertia::render('Welcome',[
            "auth"=>Auth::user() ? Auth::user() : (object) [],
            "isLocal"=>env("APP_ENV")
        ]);
    })->name("welcome");


    // トップページ
    Route::get('/topPage', [BeforeGameController::class,"show_top_page"])
    // ->middleware(["auth"])
    ->name('topPage');

    // マイページへ
    Route::get('/myPage', [ShowResultController::class,"show_my_page"])
    ->middleware(['auth'])
    ->name('myPage');

    // 自分の結果のフル表示(player/team)
    Route::get("myFullResult/{which}",[ShowResultController::class,"show_fullResults_page"])
    ->middleware(["auth"])
    ->name("myFullResult");

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
            ""=>env(""),
            "message"=>session("message")
        ]);
    })
    ->name('view_sign_page');

    // ゲームクリアのルート
    Route::get("/game.clear",[GameController::class,"game_clear"])
    ->middleware(['auth'])
    ->name("gameClear");


    // エラーがあった時のビュー
    Route::get("/error_view",function(){

        // クエリパラメータ 'message' を取得
        $message = request()->query('message', 'unExpected');

        // // ビューの表示
            return Inertia::render('Error/Custom',[
                "message"=>$message ?? "unExpected",
                "isLocal"=>env("APP_ENV")
            ])->toResponse(request())->setStatusCode(500);
    })->name("error_view");



    // 以下config用
    // 選手名とチーム名の登録(年度変更)
    // Route::get("/update_data",[ConfigController::class,"update_newYear_data"])
    // ->name("dataChange_newYear");


    // ログイン操作
    require __DIR__.'/auth.php';

});
