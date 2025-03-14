<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Exceptions\CustomException;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\GamePatternRequest;
use App\Models\Team;
use App\Models\Player;
use Inertia\Inertia;

// ゲーム中の操作
class GameController extends Controller
{
    //回答チェック
    public function answer_check(GamePatternRequest $request){

        // 2重投稿フラグ配列の存在チェック(存在さえなければエラー)
            if(!SessionController::session_exists(["quiz_unique_token"]) || !SessionController::session_isNotNull(["used_quiz_unique_tokens"])){
                // 非同期の中なのでエラーページには移動せずログ保存
                return response()->json([
                    "sessionSettingError"=>"不正な処理です"
                ]);
            }

        // 二重投稿の確認
        // 二重投稿の時は、１回目の投稿で既に新しいsessionは投稿済
         if(!$this->duplicate_post_check($request->unique_token)){
            return response()->json([
                "duplicatedError"=>"二重投稿です"
            ]);
        }

        // それぞれの代入(randとteam共通の項目)
        $user=$request->user;
        $cate=$request->cate;
        $quizType=$request->quizType;

        // quizTypeによる仕分け
        // falseの場合を除くため「===」で比較
        // この2パターン以外はRequestで弾かれている
        if(strpos($request->quizType,"rand")===0){
            // ランダムの場合は回答をそのまま比較
            $answer=$request->answer;
            // teamもそのまま比較
            $answer_team=$request->team;
            // 回答済リスト
            $already_answered_lists=json_decode($request->answered,true);
            //名前のタイプによる仕分け
            switch($request->nameType){
                case "part":
                return response()->json(
                    $this->checkAnswer_whenPart($user,$cate,$quizType,$already_answered_lists,$answer_team,$answer)
                );
                break;
                case "full":
                    return response()->json(
                        $this->checkAnswer_whenfull($user,$cate,$quizType,$already_answered_lists,$answer_team,$answer)
                    );
                break;
                default:
                return response()->json([
                    "namePatternError"=>"不正な処理です"
                ],500);
                break;
            }
        }else if(strpos($request->quizType,"team")===0){

            // 必要な回答数
            $required_answer=$request->requiredAnswer;

            // チーム別の場合は回答とチームを文字列からjsonに直す
            $answerLists=json_decode($request->answer);
            $teamLists=json_decode($request->team);

            // 回答済リストの形式をteamに合わせる
            $old_already_answered_lists=json_decode($request->answered,true);
            $already_answered_lists=[];
            foreach($old_already_answered_lists as $already_team=>$already_players){
                foreach($already_players as $already_player){
                    $already_answered_lists[]=[
                        "team"=>$already_team,
                        "player"=>$already_player
                    ];
                }
            }

            // 正解の数
            $right_counts=0;
            // それぞれの正解データが格納
            $returned_lists=[];
            // 回答済の選手リスト
            $returned_nowAnswer_alreadyLists=[];

            // それぞれの選手を回していき、正解なら正解リスト、回答済みなら回答済みリストへ入れる。
            foreach($answerLists as $key=>$answer):

                // keyを3で割った商からチームを決定
                $answer_team=$teamLists[floor($key/$required_answer)]->eng_name;

                //名前のタイプによる仕分け(それぞれをjsonではなくforeach内部で返す)
                switch($request->nameType){
                    case "part":
                        $response=$this->checkAnswer_whenPart($user,$cate,$quizType,$already_answered_lists,$answer_team,$answer);
                    break;
                    case "full":
                        $response=$this->checkAnswer_whenfull($user,$cate,$quizType,$already_answered_lists,$answer_team,$answer);
                    break;
                    default:
                    return response()->json([
                        "namePatternError"=>"不正な処理です"
                    ],500);
                    break;
                  }
                // 処理がエラーのとき
                if(array_key_exists("resultInsertError",$response)){
                    return response()->json($response);
                }

                //responseが正解のときは
                if($response["isRight"]==="right"){

                    // 正解数を加える
                    $right_counts+=count($response["playerLists"]);

                    // 正解リストに加える
                    $returned_lists[]=$response;
                // 回答済の時
                }else if($response["isRight"]==="already"){
                // return用の回答済リストに加える
                    $returned_nowAnswer_alreadyLists[]=$response;
                }
            endforeach;


            // 正解者リストを「チーム」ごとにまとめる
            $new_returned_lists=[];
            foreach($returned_lists as $list){
                if(array_key_exists($list["team"],$new_returned_lists)){
                    array_push($new_returned_lists[$list["team"]]["players"],...$list["playerLists"]);
                }else{
                    $new_returned_lists[$list["team"]]=[
                        "red"=>$list["red"],
                        "green"=>$list["green"],
                        "blue"=>$list["blue"],
                        "players"=>$list["playerLists"]
                    ];
                }
            }

            return response()->json([
                "rightCounts"=>$right_counts,
                "returnedLists"=>$new_returned_lists,
                "returnedNowAnswerAleradyLists"=>$returned_nowAnswer_alreadyLists,
                "new_token"=>session("quiz_unique_token")
            ]);
        }

        exit;
    }

    // 名前の１部での回答チェック
    public function checkAnswer_whenPart($user,$cate,$quizType,&$already_answered_lists,$answer_team,$answer){

        // そのチームの全選手リスト取得
        $player_data_in_team=Player::where("team",$answer_team)->get();
        $player_name_lists=[];
        $nowAlready_players_lists=[];
        $isRight="wrong";


        // 該当選手がいたらリスト追加（同姓などを考慮してリストにする）
        foreach($player_data_in_team as $eachplayer){

            //１：部分一致
            $part_array=explode(",",$eachplayer->part);
            foreach($part_array as $part_each){

                // partと回答があっていたとき
                if(trim($part_each)===trim($answer)){

                    //回答済かどうか
                    $this->check_existed_answer_process($player_name_lists,$already_answered_lists,$eachplayer,$isRight,$nowAlready_players_lists);

                }
            }
            // ２：fullnameの場合と同様のチェックで正解ならば正解 またジエゴとジエゴ ソウザがいた場、ジエゴでジエゴ１人しか正解にならないのを防ぐため、先に名前の1部からチェックする)
            if($this->fullname_change($answer,$eachplayer)){

                //回答済か否どうか
                $this->check_existed_answer_process($player_name_lists,$already_answered_lists,$eachplayer,$isRight,$nowAlready_players_lists);
                // 回答済であっても、正解の場合は部分一致パターンを実行せず次処理へ
                continue;
            }

        };

        // チーム名の日本語と色を取得
        $team_data=Team::where("eng_name",$answer_team)->first();

        // 結果挿入
        if($isRight==="right"){
            $isResultInsertSuccess=StoreResultController::insert_sql($player_name_lists,$answer_team,$user,"part",$quizType,$cate);
            if(!$isResultInsertSuccess["success"]){
                return[
                    "resultInsertError"=>$isResultInsertSuccess["content"]
                ];
            }
        }

        return[
            "isRight"=>$isRight,
            "team"=>$team_data->jpn_name,
            "red"=>$team_data->red,
            "green"=>$team_data->green,
            "blue"=>$team_data->blue,
            "playerLists"=>$player_name_lists,
            "nowAlreadyPlayers"=>$nowAlready_players_lists,
            "new_token"=>session("quiz_unique_token")
        ];
    }

    // フルネームでの回答チェック
    public function checkAnswer_whenFull($user,$cate,$quizType,&$already_answered_lists,$answer_team,$answer){

        // そのチームの全選手リスト取得
        $player_data_in_team=Player::where("team",$answer_team)->get();
        $player_name_lists=[];
        $nowAlready_players_lists=[];
        $isRight="wrong";

        // そのチームに所属する、その名前の選手がいるか？（同姓同名を考慮して、foreachを回す）
        foreach($player_data_in_team as $eachplayer){

            // partの間がスペース、全角スペース、黒丸の時、それを取り除いた値とのチェック
            // 正解の場合
            if($this->fullname_change($answer,$eachplayer)){
            //回答済か否か
            $this->check_existed_answer_process($player_name_lists,$already_answered_lists,$eachplayer,$isRight,$nowAlready_players_lists);
            }
        }

        // 結果挿入
        if($isRight){
        $isResultInsertSuccess=StoreResultController::insert_sql($player_name_lists,$answer_team,$user,"full",$quizType,$cate);
        if(!$isResultInsertSuccess["success"]){
            return[
                "resultInsertError"=>$isResultInsertSuccess["content"]
            ];
        }
     }

        // チーム名の日本語と色を取得
        $team_data=Team::where("eng_name",$answer_team)->first();

        return[
            "isRight"=>$isRight,
            "team"=>$team_data->jpn_name,
            "red"=>$team_data->red,
            "green"=>$team_data->green,
            "blue"=>$team_data->blue,
            "playerLists"=>$player_name_lists,
            "nowAlreadyPlayers"=>$nowAlready_players_lists,
            "new_token"=>session("quiz_unique_token")
        ];
    }

    // 重複チェック
    public function check_existed_answer_process(&$player_name_lists,&$already_answered_lists,$eachplayer,&$isRight,&$nowAlready_players_lists){


        // partと回答があっていたとき
            //回答済か否かあったとき
            if(!$this->check_existed_answer($already_answered_lists,$eachplayer)){
                $isRight="right";
                array_push($player_name_lists,$eachplayer->full);

                // 回答済リストに選手を入力
                $already_answered_lists[]=[
                    "team"=>Team::where("eng_name","=",$eachplayer->team)->pluck("jpn_name")->first(),
                    "player"=>$eachplayer->full
                ];

                // 名前の1部の場合、名前のパートを順々にチェックする場合があるため、この条件を入れておかないと、今回回答された選手が回答済になってしまう
            }else if($isRight==="wrong" || $isRight==="already"){
                $isRight="already";
                // foreachで選手ループを抜けた時に時に$returned_nowAnswer_alreadyListsに格納される
                // 名前で正解後、同じ試技で同姓の選手の苗字で成功した場合は、後者だと結果が「正解」で返されるので、前もって答えていた選手は重複で反映されない
                array_push($nowAlready_players_lists,$eachplayer->full);

            }
    }


    // 重複チェック
    // each_playerはteamとfullのセット
    // already_answered_listsはteamとfullのセットの配列
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


    // フルネームの全角/半角/・の処理
    public function fullname_change($answer,$eachplayer){

        // 直接正解のとき
        if(trim($answer)===trim($eachplayer["full"])){
            return true;
        }

        // answerのそれぞれがeachplayer["part"]と合うかどうか
        $answer_with_comma = str_replace(["・", "　", " "], ",", $answer);
        $comma_count=mb_substr_count($eachplayer["part"],",");

        // // そもそも区切りが名前にない時はreturn false(正解の場合はreturn)
        if($comma_count===0){
            return false;
        }

        // 正解の候補の格納
        $correct_candidates=[];

        // 検索の開始位置
        $point=0;

        // 1つ目のカンマの位置がstart(最初含む)、最後のカンマの位置がlast
        for($number=0;$number<$comma_count+1;$number++){
            //number番目のcommaの位置
            $newpoint=mb_strpos($eachplayer["part"],",",$point);

            // 最後のカンマ〜文字列までの時
            if ($newpoint === false) {
                $newstr = mb_substr($eachplayer["part"], $point);
            }else{
                // 前のカンマから現在のカンマの直前までの文字列
                $newstr=mb_substr($eachplayer["part"],$point,$newpoint-$point);
            }

            // 次回の検索位置を今回検索カンマの次に設定
            $point=$newpoint+1;

            // カンマあり、カンマなし、それぞれの文字列を連結
            // 空の時は正解候補に格納
            if(empty($correct_candidates)){
                $correct_candidates[]=$newstr;
                $correct_candidates[]=$newstr.",";
            }else{
            // 空でない時は正解候補と次の文字列を連結
                $new_candidate=[];
                    foreach($correct_candidates as $correct_candidate){
                        $new_candidate[]=$correct_candidate.$newstr.",";
                        $new_candidate[]=$correct_candidate.$newstr;
                    }
                // リストに格納
                $correct_candidates=$new_candidate;
            }
        }

        // 最後のカンマが入っている場合を考慮
        $correct_candidates = array_map(function($candidate) {
            return rtrim($candidate, ",");
        }, $correct_candidates);

        // 正解候補にあれば正解
        if(in_array($answer_with_comma,$correct_candidates)){
            return true;
        }

        return false;

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



        // tokenがusedされていなければ、回答者ごとの成績をsqlに挿入。returnのsessionは成功か否かを記入
        if(!SessionController::session_exists(["used_game_tokens"]) ||  !in_array(session("game_token"),session("used_game_tokens"))){
            SessionController::create_sessions([
                "isGradeInserted"=>QuizGradeController::insert_sql($username)
            ]);

            // 過去リストに挿入
            $used_game_tokens=session("used_game_tokens",[]);
            $used_game_tokens[]=session("game_token");
            SessionController::create_sessions([
                "used_game_tokens"=>$used_game_tokens
            ]);
        }

        // そのユーザーのクリア回数
        $user_number_of_times_sets=QuizGradeController::get_number_of_times($username);
        // 全体ユーザーのクリア回数
        $all_number_of_times_sets=QuizGradeController::get_number_of_times();


        // クイズタイプをUI表示に見やすい形式に
        $quiz_type_inJpn=StaticValueController::$QuizSets[session("quiz_type")];

        // クリア画面へ
        return Inertia::render('Game/Clear',[
            "userName"=>$username,
            "name_type"=>session("name_type")=== "part" ? "名前の一部" : "登録名",
            "quiz_type"=>$quiz_type_inJpn,
            "cate"=>session("cate")==="all" ? "全て" : session("cate"),
            "userNumberSets"=>$user_number_of_times_sets,
            "allNumberSets"=>$all_number_of_times_sets,
            "canGradeUpdated"=>session("isGradeInserted")
        ]);
    }


    // クイズ二重投稿の確認
    public function duplicate_post_check($unique_token){

        // 過去のリストにあれば二重投稿
            if(in_array($unique_token,session("used_quiz_unique_tokens"))){
                Log::info("duplicated");
                return false;
            }

        // 過去のリストへtoken追加(sessionヘルパー関数は単純に追加はできない)
            $array=session("used_quiz_unique_tokens");
            $array[]=$unique_token;
            SessionController::create_sessions([
                "used_quiz_unique_tokens"=>$array
            ]);


         // 新たにtoken作成
         SessionController::createSessionNotWithinArray("quiz_unique_token","used_quiz_unique_tokens");
        return true;
    }


}
