<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use App\Models\User;

class newUserUniqueRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        //newUserNameがUserテーブルのnameに使われていたらfail
        if(User::where("name","=",$value)->exists()){
            $fail("そのユーザー名は既に使用されています");
        }
    }
}
