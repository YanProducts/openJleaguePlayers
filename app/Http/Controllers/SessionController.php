<?php

namespace App\Http\Controllers;
use Illuminate\Support\Str;
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

    // sessionまとめて確認、なければfalseを返す(keyを配列で渡す)。confirm_session_valueから呼び出す場合も多々あり。
    public static function session_exists($session_lists){
        foreach($session_lists as $key){
            if(empty(session($key))){
                return false;
            }
        }
        return true;
    }

    // sessionでarrayなどが定義されているかをチェック。空の場合もtrue
    public static function session_isNotNull($session_lists){
        foreach($session_lists as $key){
            if(null===session($key)){
                return false;
            }
        }
        return true;
    }

    // sessionが期待通りの値を持っているかの確認。keyを配列で渡して、入っていなければfalseを返す
    public static function confirm_session_value($session_lists){

        // そもそも存在するか
        if(!self::session_exists($session_lists)){
            return false;
        }

        // 値が期待通りか
        foreach($session_lists as $key){
            switch($key){
                case "cate":
                    if(!in_array(session($key),array_keys(StaticValueController::$CateSets))){
                        return false;
                    }
                break;
                case "quiz_type":
                    if(!in_array(session($key),array_keys(StaticValueController::$QuizSets))){
                        return false;
                    }
                break;
                case "name_type":
                    if(!in_array(session($key),array_keys(StaticValueController::$NameSets))){
                        return false;
                    }
                break;
                default:
                    // 特に何もしない
                break;
            }

        }
        return true;
    }

    // ある配列に含まれないsessionを作成する
    static public function createSessionNotWithinArray($str_name,$array_name){
        // そのゲームのトークン作成(成績表示の際に2重投稿防止)
        if(!self::session_exists([$array_name]) && self::session_isNotNull([$array_name])){
            do{
                $new_str=Str::random(40);
            }while(in_array($new_str,session("used_game_tokens")));
        }else{
            $new_str=Str::random(40);
        }
        self::create_sessions([$str_name=>$new_str]);
    }

}
