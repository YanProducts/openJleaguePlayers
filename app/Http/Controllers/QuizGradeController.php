<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User_archive;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class QuizGradeController extends Controller
{
    //回答者ごとの成績挿入
    public static function insert_sql($username){

        try{
          DB::transaction(function()use($username){
              $data=new User_archive();
              $data->user=$username;
              $data->cateType=session("cate");
              $data->quizType=session("quiz_type");
              $data->nameType=session("name_type");
              $data->save();
          });
          return ["isSuccess"=>true];
        }catch(\Throwable $e){
            // エラー時は結果発表に「何らかのエラー」と伝える
            return [
                "isSuccess"=>false,
                "errorType"=>env("APP_ENV")==="local" ? $e->getMessage() :"何らかのエラーです"
            ];
        }
    }


    // 何回目のクリアか
    public static function get_number_of_times($username=null){

        // 全体
        if(empty($username)){
            $clearSets=User_archive::all();
        // 特定ユーザー
        }else{
            $clearSets=User_archive::where("user","=",$username)->get();
        }


        $all_counts=count($clearSets);
        $cateType_counts=$clearSets->filter(function($item){
            return $item->cateType == session("cate");
        })->count();
        $nameType_counts=$clearSets->filter(function($item){
            return strtolower($item->nameType)==session("name_type");
        })->count();
        $quizType_counts=$clearSets->filter(function($item){
            return strtolower($item->quizType)==session("quiz_type");
        })->count();

        return([
            "all"=>$all_counts,
            "cate"=>$cateType_counts,
            "name"=>$nameType_counts,
            "quiz"=>$quizType_counts
        ]);
    }

}
