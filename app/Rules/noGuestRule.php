<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class noGuestRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        //ユーザー名を「ゲスト」にしない
        if(preg_match("/^(ゲスト)$/u",$value)){
            $fail("ユーザー名をゲストにはしないでください");
        }
    }
}
