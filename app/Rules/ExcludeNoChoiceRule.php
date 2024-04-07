<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ExcludeNoChoiceRule implements ValidationRule
{

    // 他のルールにも適用する
    protected $rule;
    // インスタンス化と同時に、他のルールも呼び出す
    public function __construct(ValidationRule $rule)
    {
        $this->rule = $rule;
    }
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        //no_choiceだったときに一括fail
        if($value==="no_choice"){
            $fail("選択されていません");
            // no_choiceの場合は何もしない
            return;
        }

        // 次に、デコレートされたルールのバリデーションを実行
        $this->rule->validate($attribute, $value, $fail);
    }
}
