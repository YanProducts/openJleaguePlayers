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
        $quiz_type=$request->quiz_type;
        $name_type=$request->name_type;
        $cate=$request->cate;
        $answer_team=$request->answerTeam;

        //そのチームに選手が存在するか否か
        


    }
}
