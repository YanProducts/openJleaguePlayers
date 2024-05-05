<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ConfigController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\BeforeGameController;
use App\Http\Controllers\StaticValueController;
use App\Http\Controllers\TestController;

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

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        "topRoute"=>route("topPage")
    ]);
});

// ログイン認証
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// トップページ
Route::get('/topPage', [BeforeGameController::class,"show_top_page"])
->middleware(['auth', 'verified'])
->name('topPage');

// ゲーム種類決定
Route::post("/game.decide_pattern",[BeforeGameController::class,"decide_game_pattern"])
->name("decideGamePattern");

// ゲーム開始
Route::get("/game.play",[BeforeGameController::class,"to_game_page_view"])
->middleware(['auth', 'verified'])
->name("play_game");


// 回答があっているか？
Route::post("/game/answerCheck",[GameController::class,"answer_check"])
->middleware(['auth', 'verified'])
->name("answerCheck");




//お知らせ
Route::get('/sign', function () {
    return Inertia::render('Sign',[
        "message"=>session("message")
    ]);
})->middleware(['auth', 'verified'])->name('view_sign_page');



// 以下config用
// 選手名とチーム名の登録(年度変更)
Route::get("/update_data",[ConfigController::class,"update_newYear_data"])
->name("dataChange_newYear");

// 以下テスト用
// エラーテスト
Route::get("test/error",[TestController::class,"test_error"]);

require __DIR__.'/auth.php';
