<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// ユーザーごとのクイズ成績

class User_archive extends Model
{
    use HasFactory;

    protected $fillable=[
        "user","cateType","quizType","nameType"
    ];

}
