<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable=[
        "eng_name","jpn_name","cate","red","blue","green"
    ];

    // Teamsモデルからのインスタンス（つまり単数）に対してリレーションでつながっているeng_nameと同じteamカラムを持つplayerテーブルのコレクション（複数）を取得
    public function players(){
        // 第二引数には子モデルの外部キー（子：複数）、第三引数にはこのモデルの主キー(親：１つ)
       return $this->hasMany(Player::class,"team","eng_name");
    }

}
