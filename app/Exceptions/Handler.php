<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    // エラーがあった時のビュー
    public function render($request,Throwable $exception){
        if($exception instanceof CustomException){
            // // ビューの表示
            return Inertia::render('Error/Custom',[
                "message"=>$exception->getMessage(),
                "top_page"=>route("topPage")
            ],500);
        }
        return parent::render($request,$exception);
    }

}
