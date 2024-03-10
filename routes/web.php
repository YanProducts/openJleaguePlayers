<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ConfigController;

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
    ]);
});

// ログイン認証
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ログイン後の画面
Route::get('/topPage', function () {
    return Inertia::render('TopPage',[
        "csrf_token"=>csrf_token()
    ]);
})->middleware(['auth', 'verified'])->name('topPage');

// 選手名とチーム名の登録(年度変更)
Route::get("/update_data",[ConfigController::class,"update_newYear_data"])
->name("dataChange_newYear");

//お知らせ
Route::get('/sign', function () {

    return Inertia::render('Sign',[
        "message"=>session("message")
    ]);
})->middleware(['auth', 'verified'])->name('view_sign_page');


require __DIR__.'/auth.php';
