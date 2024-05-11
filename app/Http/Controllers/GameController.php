<?php

namespace App\Http\Controllers;

use App\Http\Requests\GamePatternRequest;
use App\Models\Team;
use App\Models\Player;
use App\models\Results;
use Illuminate\Http\Request;

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

        //そのチームに選手が存在するか否か
        switch($name_type){
            case "part":
             return response()->json(
                 $this->checkAnswer_whenPart($answer,$answer_team)
             );
             break;
             case "full":
                return response()->json(
                    $this->checkAnswer_whenfull($answer,$answer_team)
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

    // 名前の部分での回答チェック
    public function checkAnswer_whenPart($answer,$answer_team){
        // そのチームに所属する、その名前の選手がいるか？
        $isRight=Player::where("team",$answer_team)
        ->pluck("part")
        ->contains(function($part)use($answer){
            return in_array($answer,explode(",",$part));
        });

        return[
            "team"=>$answer_team,
            "is_right"=>$isRight,
        ];
    }

    // フルネームでの回答チェック
    public function checkAnswer_whenFull($answer,$answer_team){
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

}
