<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class CategoryRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        //カテゴリー種類のルール

        //選択なしの場合

        if(!preg_match("/^(J1|J2|J3|all)$/",$value)){
            $fail("カテゴリー名の異常です");
        }
    }
}
