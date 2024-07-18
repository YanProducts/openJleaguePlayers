<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use App\Models\User;

class userIsExistsRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        //ユーザーが実在するかどうか
        // commonUserもしくは登録されているユーザー
        if(
            !preg_match("/^(commonUser)$/",$value) && !User::where("name",$value)->exists()
            ){
            $fail("ユーザーが存在しません");
        }

    }
}
