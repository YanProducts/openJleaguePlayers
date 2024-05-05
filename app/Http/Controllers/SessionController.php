<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

// 複数個のsessionそ操作したい時に使用
class SessionController extends Controller
{
    // sessionまとめて作成(key=>valueの入れ子配列を渡す)
    public static function create_sessions($session_lists){
        foreach($session_lists as $key=>$value){
            session([$key=>$value]);
        }
    }

    // sessionまとめて削除(keyを配列で渡す)
    public static function delete_sessions($session_lists){
        foreach($session_lists as $key){
            session()->forget($key);
        }
    }

    // sessionまとめて確認、なければ別falseを返す(keyを配列で渡す)
    public static function confirm_sessions($session_lists){
        foreach($session_lists as $key){
            if(empty(session($key))){
                return false;
            }
        }
        return true;
    }

}
