<?php

namespace App\Http\Controllers;

use App\Exceptions\CustomException;
use App\Http\Requests\GamePatternRequest;
use App\Models\Player;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


use Illuminate\Support\Facades\Log;

class ReadController extends Controller
{



    // ゲームパターンが決定後、そのパターンを返す
    public function decide_game_pattern(GamePatternRequest $request){
    // public function decide_game_pattern(Request $request){
        Log::info("a");

        // 実験のため、即座にjsonで返す
        return response()->json([
            "error" => "a"
        ]);



        // ゲームパターン
        $cate=$request->cate;
        $quiz_type=$request->quizType;
        $name_type=$request->nameType;

        // 該当選手リスト(コレクションで定義)
        $player_lists=collect();

        try{
            DB::transaction(function()use($cate,&$player_lists){
                // チーム一覧の取得
                $cate==="all" ? $selected_teams=Team::all():$selected_teams=Team::where("cate","=",$cate)->get();

                // そのカテの選手データを追加
                foreach($selected_teams as $team){
                    $player_lists=$player_lists->merge($team->players);
                }
            });
        }catch(\Throwable $e){
            // fetchAPIからの投稿をjsonで返す
            $json_error=json_encode([
                "error"=>$e->getMessage()
            ]);
            header("Content-Type:application/json");
            echo $json_error;
            exit;
            // クイズタイプがチームごとかランダムか
            // throw new CustomException("選手取得時のエラーです");
        }

        // fetchAPIからの投稿をjsonで返す
        $play_game_json_data=json_encode([
            "players_data"=>$player_lists,
            "name_type"=>$name_type==="full" ? "本名" : "名前の一部",
            "quiz_type"=>$quiz_type,
            "cate"=> $cate == "all" ? "全カテ" : $cate
        ]);
        header("Content-Type:application/json");
        echo $play_game_json_data;
        exit;

    }
}
