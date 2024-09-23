<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facedes\Storage;
use App\Models\Team;
use App\Models\Player;
use App\Models\Result;
use App\Models\Archive;
use App\Exceptions\CustomException;

class ConfigController extends Controller
{
    // 選手とチームの(年度変更時)
    public function update_newYear_data(){

      try{
          // チームデータのパス取得
          $teams_data_path=storage_path("app/files/team_cate_sets");
          // 選手データのパス取得
          $players_data_path=storage_path("app/files/team_name");
      }catch(\Throwable $e){
          // カスタム例外スロー
          throw new CustomException(env("APP_ENV")==="local" ? $e->getMessage(): "ファイルパス取得時のエラーです");
      }

        // １度空にする(foreign keyの関係上、先にTeamを行う)
        Player::query()->delete();
        Team::query()->delete();

        // チームデータ登録
        $this->update_newYear_team_data($teams_data_path);

        // 選手データ更新
        $this->update_newYear_player_data($players_data_path);

        // お知らせ
        return redirect()->route("view_sign_page")->with([
            "message"=>"登録完了しました！"
        ]);
    }

    // その年度のチームデータの更新
    public function update_newYear_team_data($teams_data_path){
        try{
            // データの取得
            $team_data=file($teams_data_path."/team_cate.txt");

            // 処理
            DB::transaction(function()use($team_data){
                foreach($team_data as $each_team_data){
                 $each_team_data_inArray=explode(",",trim($each_team_data));
                //  sql登録
                 $this->update_each_team_data($each_team_data_inArray);
                }
            });
        }catch(\Throwable $e){
        // カスタム例外スロー
          throw new CustomException(env("APP_ENV")==="local" ? $e->getMessage(): "チーム登録時のエラーです");
        }
    }

    // その年度の選手データの更新
    public function update_newYear_player_data($players_data_path){
        try{
            // チームごとの全ファイルの名前の取得
            $players_data_filenames=glob($players_data_path."/*.txt");

            // 去年のデータの履歴登録
            $this->store_lastyear_data();

            DB::transaction(function()use($players_data_filenames){
                // 各チームファイルの取得
                foreach($players_data_filenames as $players_data_filename){
                   $players_in_each_team=file($players_data_filename);
                    //sql登録
                    $this->update_each_player_data($players_data_filename,$players_in_each_team);
                }
            });
        }catch(\Throwable $e){
          // カスタム例外スロー
          throw new CustomException(env("APP_ENV")==="local" ? $e->getMessage():          "選手登録時のエラーです");
        }
    }

    // ファイルからのチームデータ登録(トランザクション内部に既にいる)
    public function update_each_team_data($each_team_data_inArray){
        $team=new Team();
        $team->eng_name=$each_team_data_inArray[0];
        $team->jpn_name=$each_team_data_inArray[1];
        $team->cate=$each_team_data_inArray[2];
        $team->red=$each_team_data_inArray[3];
        $team->green=$each_team_data_inArray[4];
        $team->blue=$each_team_data_inArray[5];
        $team->save();
    }

    // ファイルからのチームごとの選手データ登録(トランザクション内部に既にいる)
    public function update_each_player_data($filename,$lists){

        // 正規表現
        $ptn_num="/(?:[0-9])+/u";
        $ptn_name="/(?:[ぁ-ん]|[ァ-ヴー]|[一-龠﨑々（）]|　)+/u";
        $teamnamelists=[];

        // id番号
        $id_n=0;

     // txtファイルを開いて１行ずつ取り出す
        $slashpoint=mb_strpos($filename,"team_name");
        $teamandtxt=mb_substr($filename,$slashpoint+10);
        $team=mb_substr($teamandtxt,0,mb_strlen($teamandtxt)-4);

        $n=0;

        foreach($lists as $list){

            // 選手データは３行に１つ
            if($n%3===0){

            // 初期化
            $fullname="";
            $restname="";
            $partname=[];

            // 正規表現
            preg_match_all($ptn_num,$list,$numbase);
            preg_match_all($ptn_name,$list,$namebase);

            // スペースが初めからない時の初期設定
            $fullname=$namebase[0][0];
            $partname[]=$namebase[0][0];
            $restname=$namebase[0][0];

            $spacepoint=mb_strpos($namebase[0][0],"　");
            $repeat=0;

            // スペースごとに区切って名前を文字列に格納
            while(!empty($spacepoint)){
            $partname[]=mb_substr($partname[count($partname)-1],$spacepoint+1);
            array_splice($partname,count($partname)-2,1,mb_substr($restname,0,$spacepoint));
            $restname=mb_substr($restname,$spacepoint+1);
            $fullname=implode("",$partname);
            $spacepoint=mb_strpos($restname,"　");
            }

            // sql登録
            $player_data=new Player();
            $player_data->team=$team;
            $player_data->part=implode(",",$partname);
            $player_data->full=$fullname;
            $player_data->save();
            }
            // 次の行へ
            $n++;
        }
    }

    // 去年のデータの登録
    public function store_lastyear_data(){

    }

}
