<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestController extends Controller
{
    //色々と試したい時用のコントローラー
    public function test_error(){
        throw new \Exception("エラーテスト");
    }
}
