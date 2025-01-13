<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\UserAndRememberExistsRequests;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


// オートログインのチェック
class RememberController extends Controller
{
    //nameとrememberからパスワードを返す
    public function get_pass_from_token(UserAndRememberExistsRequests $request){

         $user=User::where([
            ["name","=",$request->name],
            ["remember_token","=",$request->remember]
        ])->first();

        // データがない時はnonDataで変換
        if(!$user){
            return response()->json([
                "userName"=>"nonData"
            ]);
        }

        // データ存在する時はログイン状態にする
        Auth::login($user);
        return response()->json([
                "userName"=>$request->name
            ]);
    }
}
