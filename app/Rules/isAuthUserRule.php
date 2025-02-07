<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Auth;

class isAuthUserRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        //ユーザー名がauth.user()->nameと同じかをチェック(Auth::user()?->nameとしてしまうと、valueがnullの時にセーフになるからissetと分ける)
        if(!Auth::check() || !isset(Auth::user()->name) ||Auth::user()->name!==$value){
            $fail("現在のユーザー名が違います");
        }
    }
}
