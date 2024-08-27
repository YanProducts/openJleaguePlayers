<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Log;

class OriginalPasswordRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // 英語半角の大文字小文字と数字を含む
        $preg_must="/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$/";

        Log::info($value);
        if(!preg_match($preg_must,$value)){
            $fail("パスワードは大文字・小文字・数字を全て含んでください");
        }


        // 英語半角の大文字小文字と数字と記号以外はアウト
        // 文字列の先頭に^をつけ、それ以外のものをチョイス＝falseだとOK
        $preg_choice = "/[^A-Za-z0-9!@#$%^&*()_+\-={}[\]:;'\"|<>,.?\/]/u";
        if(preg_match($preg_choice,$value)){
            $fail("パスワードは英語の大文字小文字・数字・記号(!@#$%^&*()_+\-={}[\]:;'\"|<>,.?\/)のどれかを利用してください");
        }

        if(strlen($value)<8){
            $fail("パスワードは８文字以上にしてください");
        }

    }
}
