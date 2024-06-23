<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\Result as ResultModel;
use Illuminate\Support\Facades\DB;
use LDAP\Result;


class StoreResultController extends Controller
{
    //結果のsqlに挿入するコントローラー

    // 結果挿入の段取り
    public static function insert_sql($player_name_lists,$team,$user,$name_type,$quiz_type,$cate_type){
        try{
            DB::transaction(function()use($player_name_lists,$team,$user,$name_type,$quiz_type,$cate_type){
                foreach($player_name_lists as $player){
                    $result=new ResultModel;
                    $result->team=$team;
                    $result->challenger=$user;
                    $result->nameType=$name_type;
                    $result->cateType=$cate_type;
                    $result->quizType=$quiz_type;
                    $result->full=$player;
                    $result->save();
                }
            });
        }catch(\Throwable $e){
            // エラーを返す
            return[
                "success"=>false,
                // "content"=>"結果挿入のエラーです"
                "content"=>$e->getMessage()
            ];
        }
        return[
            "success"=>true,
            "content"=>"挿入完了しました"
        ];
    }

}
