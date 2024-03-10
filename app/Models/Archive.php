<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Archive extends Model
{
    use HasFactory;
    protected $fillable=[
        "team","part","full","right_part","right_full","cateType","quizType","nameType","challenger","season"
    ];
}
