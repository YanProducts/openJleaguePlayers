<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class NameTypeRule implements ValidationRule
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

        $preg_type=$this->route==="fetchMyData" ? "/^(part|full|all)$/" : "/^(part|full)$/";


        // 名前のタイプがフルか一部か
        // if(!preg_match("/^(part|full)$/",$value)){
        if(!preg_match($preg_type,$value)){
            $fail("回答形式の異常です");
        }
    }
}
