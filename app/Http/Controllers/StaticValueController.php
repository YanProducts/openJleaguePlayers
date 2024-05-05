<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

// HTML要素に表示する定数
class StaticValueController extends Controller
{
    static $CateSets=[
        "J1"=>"J1",
        "J2"=>"J2",
        "J3"=>"J3",
        "all"=>"全て",
    ];

    static $QuizSets=[
        "team1"=>"チーム1人ずつ",
        "team3"=>"チーム3人ずつ",
        "team5"=>"チーム5人ずつ",
        "team11"=>"チーム11人ずつ",
        "team20"=>"チーム20人ずつ",
        "rand20"=>"ランダム20人",
        "rand50"=>"ランダム50人",
        "rand100"=>"ランダム100人",
        "rand200"=>"ランダム200人",
    ];

    static $NameSets=[
        "part"=>"登録名の一部",
        "full"=>"登録名",
    ];

}
