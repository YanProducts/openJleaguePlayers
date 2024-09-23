<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Requests\GamePatternRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Result;
use App\Models\User_archive;
use App\Models\Team;
use Illuminate\Support\Facades\Log;


// 結果表示
class ShowResultController extends Controller
{
        // マイページを見る
        public function show_my_page(){
            return Inertia::render('MyPage', [
                // 各オプション
                "cateSets"=>json_encode(StaticValueController::$CateSets),
                "quizSets"=>json_encode(StaticValueController::$QuizSets),
                "nameSets"=>json_encode(StaticValueController::$NameSets),
                // ユーザー名
                "user"=>Auth::user(),
            ]);
        }

        // 検索に従ったデータを返す
        public function fetch_my_data(GamePatternRequest $request){
            $user_name=$request->user;
            $cate=$request->cate;
            $quizType=$request->quizType;
            $nameType=$request->nameType;


            // それぞれの回答における条件に合う結果を抽出
            $each_answer_basedata=Result::where("challenger","=",$user_name);

            if($cate!=="all"){
                $each_answer_basedata->where("cateType","=",$cate);
            }
            if($quizType!=="all"){
                $each_answer_basedata->where("quizType","=",$quizType);
            }
            if($nameType!=="all"){
                $each_answer_basedata->where("nameType","=",$nameType);
            }

            // クエリビルダをgetで塗り替えないように、上の2つはcloneしたものを使用
            // 選手一覧
            $pre_each_answer_data_by_player=(clone $each_answer_basedata)->groupBy(["full","team"])->selectRaw("full,team,count(*) as count")->orderBy("count","desc")->get();

            // 選手一覧のコレクションから、各チームの色を取得
            $each_answer_data_by_player=$this->add_team_color($pre_each_answer_data_by_player,"myPage_player");

            // チーム一覧
            $pre_each_answer_data_by_team=(clone $each_answer_basedata)->groupBy("team")->selectRaw("team, count(*) as count")
            ->orderBy("count","desc")->get();

            // チーム一覧のコレクションから、各チームの色を取得
            $each_answer_data_by_team=$this->add_team_color($pre_each_answer_data_by_team,"myPage_team");


            // 合計回数
            $each_answer_total_counts=$each_answer_basedata->count();

            // クリア回数における条件に合う結果を抽出
            $clear_count_basedata=User_archive::where("user","=",$user_name);
            if($cate!=="all"){
                $clear_count_basedata->where("cateType","=",$cate);
            }
            if($quizType!=="all"){
                $clear_count_basedata->where("quizType","=",$quizType);
            }
            if($nameType!=="all"){
                $clear_count_basedata->where("nameType","=",$nameType);
            }
            $clear_count_data=$clear_count_basedata->count();

            return response()->json([
                "eachAnswerTotalCounts"=>$each_answer_total_counts,
                "eachAnswerDataByPlayer"=>$each_answer_data_by_player,
                "eachAnswerDataByTeam"=>$each_answer_data_by_team,
                "clearCountData"=>$clear_count_data
            ]);
        }

        // 返す配列にチームカラーを追加
        public function add_team_color($pre_data,$what){
            $new_data=[];
            // チーム名のリストをデータの入った配列より取得(sqlへのアクセス回数を減らすために、1度に全てを取得)
            $team_lists=$pre_data->pluck("team")->unique();

            // Teamテーブルから、eng_nameをキーに、配列を取得
            $all_team_data=Team::whereIn("eng_name",$team_lists)->get()->keyBy("eng_name");

            foreach($pre_data as $pre){
                $team_data=$all_team_data[$pre->team];

                if(empty($team_data)){
                    break;
                }

                $new_item=[
                    "count"=>$pre->count,
                    "team"=>$team_data->jpn_name,
                    "red"=>$team_data->red,
                    "green"=>$team_data->green,
                    "blue"=>$team_data->blue
                ];
                if($what==="myPage_player"){
                    $new_item["full"]=$pre->full;
                }
                $new_data[]=$new_item;
            }
            return $new_data;
        }


}


