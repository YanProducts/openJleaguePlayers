<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Log;

class QuizTypeRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */

    protected $route;
    public function __construct($route)
    {
        $this->route=$route;
    }


    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // クイズ形式のルール
        $pattern=[
            "team1",
            "team3",
            "team4",
            "team5",
            "team11",
            "team20",
            "rand20",
            "rand50",
            "rand100",
            "rand200",
        ];

         if($this->route==="fetchMyData"){
            $pattern[]="all";
        }

        if(!in_array($value,$pattern)){
            $fail("回答形式の異常です");
        }
    }
}
