<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    use HasFactory;
    protected $fillable=[
        "team","part","full",
    ];
    // 取り出された単数のPlayerモデルからのインスタンス(つまり単数)に対しての所属するteamのインスタンス(つまり単数)を取得
    // select()でも行えるが、念の為宣言する
    public function team(){
        // 第二引数にはこのモデルの外部キー(子：複数) 、第三引数にはリレーションモデルの主キー（親：１つ）
        return $this->belongsTo(Team::class,"team","eng_name");
    }

}
