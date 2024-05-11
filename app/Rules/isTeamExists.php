<?php

namespace App\Rules;

use Closure;
use App\Models\Team;
use Illuminate\Contracts\Validation\ValidationRule;

// 回答したチームが存在するかのルール
class isTeamExists implements ValidationRule
{
    public $cate;
    public function __construct($cate)
    {
        $this->cate=$cate;
    }

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        switch($this->cate){
            case "J1":
            case "J2":
            case "J3":
                if(!Team::where([
                    ["cate","=",$this->cate],
                    ["eng_name","=",$value],
                ])->exists()){
                    $fail("チームが見当たりません");
                }
            break;
            case "all":
                if(!Team::where("eng_name","=",$value)->exists()){
                    $fail("チームが見当たりません");
                }
            break;
            default:
                $fail("カテゴリーのエラーです");
            break;
        }
    }
}
