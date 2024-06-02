<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Exceptions\CustomException;
use App\Http\Requests\GamePatternRequest;
use App\Models\Team;
use App\Models\Player;
use App\models\Results;
use Illuminate\Http\Request;
use Inertia\Inertia;

// ゲーム中の操作
class GameController extends Controller
{
    //回答チェック
    public function answer_check(GamePatternRequest $request){

        $answer=$request->answer;
        $quiz_type=$request->quizType;
        $name_type=$request->nameType;
        $cate=$request->cate;
        $answer_team=$request->team;
        $already_answered_lists=json_decode($request->answered,true);


        //そのチームに選手が存在するか否か
        switch($name_type){
            case "part":
             return response()->json(
                 $this->checkAnswer_whenPart($answer,$answer_team,$already_answered_lists)
             );
             break;
             case "full":
                return response()->json(
                    $this->checkAnswer_whenfull($answer,$answer_team,$already_answered_lists)
                );
            break;
            default:
            return response()->json([
                "error"=>"不正な処理です"
            ],500);
            break;
        }
        exit;
    }

    // 名前の１部での回答チェック
    public function checkAnswer_whenPart($answer,$answer_team,$already_answered_lists){

        // そのチームの全選手リスト取得
        $player_data_in_team=Player::where("team",$answer_team)->get();
        $player_name_lists=[];
        $isRight="wrong";

        // 該当選手がいたらリスト追加（同姓などを考慮してリストにする）
        foreach($player_data_in_team as $eachplayer){
            $part_array=explode(",",$eachplayer->part);
            foreach($part_array as $part_each){
                // partと回答があっていたとき
                if($part_each===$answer){
                    //回答済か否かあったとき
                    if(!$this->check_existed_answer($already_answered_lists,$eachplayer)){
                        $isRight="right";
                        array_push($player_name_lists,$eachplayer->full);
                    }else if($isRight==="wrong"){
                        $isRight="already";
                    }
                }
            }
        };

        // チーム名の日本語と色を取得
        $team_data=Team::where("eng_name",$answer_team)->first();

        return[
            "isRight"=>$isRight,
            "team"=>$team_data->jpn_name,
            "red"=>$team_data->red,
            "green"=>$team_data->green,
            "blue"=>$team_data->blue,
            "playerLists"=>$player_name_lists
        ];
    }

    // フルネームでの回答チェック
    public function checkAnswer_whenFull($answer,$answer_team,$already_answered_lists){
        // そのチームに所属する、その名前の選手がいるか？
        if(Player::where([
            ["full","=",$answer],
            ["team","=",$answer_team]
        ])->exists()){
            return[
                "is_right"=>"right"
            ];
        }else{
            return[
                "is_right"=>"false"
            ];
        }
    }

    // 重複チェック
    public function check_existed_answer($already_answered_lists,$eachplayer){
        if(empty($already_answered_lists)){
            return false;
        }


        $is_already=false;

        //その選手とそのチームが回答済なら、必ず回答済
        foreach($already_answered_lists as $already_answer){


            $eng_team=Team::where("jpn_name",$already_answer["team"])->pluck("eng_name")->first();
            if($eng_team===$eachplayer->team &&
            $already_answer["player"] ===$eachplayer->full){
                $is_already=true;
                break;
            }
        }
        return $is_already;
    }

    // ゲームクリア
    public function game_clear(){

        // sessionの値が期待と違った時
        if(!SessionController::confirm_session_value(["cate","quiz_type","name_type"])){
            //エラーページへ
            throw new CustomException(env("APP_ENV")==="local" ? "sessionの値が期待と違います": "不正なルートです");
        }

        // ログイン情報取得
        $userInfomation=Auth::user();
        $username=$userInfomation->name;



        // sessionの再度チャレンジできるようsessionの削除はしない

        // sqlに挿入
        // 名前はどうゲットするか？

        // クイズタイプをUI表示に見やすい形式に
        $quiz_type_inJpn=StaticValueController::$QuizSets[session("quiz_type")];

        // クリア画面へ
        return Inertia::render('Game/Clear',[
            "name_type"=>session("name_type")=== "part" ? "名前の一部" : "登録名",
            "quiz_type"=>$quiz_type_inJpn,
            "cate"=>session("cate")==="all" ? "全て" : session("cate"),
        ]);
    }

}
