<?php

namespace App\Http\Controllers;

use App\Exceptions\CustomException;
use App\Http\Requests\GamePatternRequest;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class BeforeGameController extends Controller
{

    // topPageの表示
    // ログイン状態である場合のみ表示（ログインできていない場合は速攻で返す）
    // 引数のrememberは「ログインから来て、かつ保持の印があったとき」のみ記載(previosuRememberをyesに変更)
    public function show_top_page(){


        // ログインできていない場合はオートログインを試す(rememberとremember_tokenとnameが正しいか否か)
        if (!Auth::check() || !isset(Auth::user()->name)) {
            return Inertia::render("Auth/AutoLogin");
        }

        // ログイン時は値をセット
        $user=Auth::check() ? Auth::user()->name : null;

        $user_data=User::where("name","=",$user)->first();
        // userが存在しない時は戻す
        if(!$user_data){
            return redirect()->route("error_view",["message"=>"登録データがありません"]);
        }

        // 新しいremember_tokenの設定
        $new_remember_token=bin2hex(random_bytes(32));
        $user_data->remember_token=$new_remember_token;
        $user_data->save();

        // rememberの登録
        $remember=session("remember_which");

        // session削除
        SessionController::delete_sessions(([
            "cate","quiz_type","name_type",
            "selected_teams",
            "used_quiz_uniwue_tokens",
            "quiz_unique_token",
            "used_game_tokens",
            "game_token",
            "isGradeInserted",
            "remember_which"
        ]));

        // ページ表示
        return Inertia::render('TopPage',[
            // 年度の設定
            "year"=>empty(session("year")) ? date("y",time()) : session("year"),

            // 各オプション
            "cateSets"=>json_encode(StaticValueController::$CateSets),
            "quizSets"=>json_encode(StaticValueController::$QuizSets),
            "nameSets"=>json_encode(StaticValueController::$NameSets),
            // ユーザー名
            "user"=>$user,
            "newToken"=>$new_remember_token,
            "remember"=>$remember,

            // 開発か否か
            "isLocal"=>env("APP_ENV")
        ]);
    }


    // ゲームパターンが決定後、そのパターンを返す
    public function decide_game_pattern(GamePatternRequest $request){

        // 前段階のsession削除
        SessionController::delete_sessions(["cate","quiz_type","name_type","selected_teams"]);

        // ゲームパターン
        $cate=$request->cate;
        $quiz_type=$request->quizType;
        $name_type=$request->nameType;

        // 後でも使うため宣言
        $selected_teams=collect();

        try{
            DB::transaction(function()use($cate, &$selected_teams){
                // チーム一覧の取得
                $cate==="all" ? $selected_teams=Team::all():$selected_teams=Team::where("cate","=",$cate)->get();
            });
        }catch(\Throwable $e){
            // fetchAPIからの投稿をjsonで返す
            return response()->json([
                "error"=>$e->getMessage()
            ],500);
        }

        // session作成
        SessionController::create_sessions(([
            "cate"=>$cate,"quiz_type"=>$quiz_type,"name_type"=>$name_type,
            "selected_teams"=>$selected_teams
        ]));

        // fetchAPIからの投稿をjsonで返す
        // 使用はしない
        return response()->json([
            "is_success"=>"success"
        ]);

    }


    // ゲーム種類決定→ゲームページへ
    public function to_game_page_view(){

        // sessionがあるか？
        if(!SessionController::confirm_session_value(["cate","quiz_type","name_type","selected_teams"])){
            throw new CustomException("ゲームの種類を選択してください");
        }

        // 成績表示の時の二重投稿防止
        SessionController::createSessionNotWithinArray("game_token","used_game_tokens");

        // 二重投稿防止用に初期のセッションのセット
        SessionController::create_sessions([
            "quiz_unique_token"=>Str::random(40),
            "used_quiz_unique_tokens"=>[]
        ]);

        // 上記でsessionの値はconfirm済
        if(strpos(session("quiz_type"),"rand")===0){
            $game="Game/PlayRand";
        }else if(strpos(session("quiz_type"),"team")===0){
            $game="Game/PlayTeam";
        }

        return Inertia::render($game,[
            // 年度の設定!?????
            "year"=>empty(session("year")) ? date("y",time()) : session("year"),

            // ユーザー名
            "user"=>Auth::user(),
            "name_type"=>session("name_type")=== "part" ? "名前の一部" : "登録名",
            "quiz_type"=>session("quiz_type"),
            "cate"=>session("cate"),
            "teams"=>session("selected_teams"),

            // 二重投稿防止のsession
            "unique_token"=>session("quiz_unique_token"),

        ]);
    }


}
