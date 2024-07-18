<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

// バリデーションエラーのカスタマイズ
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

use App\Rules\CategoryRule;
use App\Rules\ExcludeNoChoiceRule;
use App\Rules\isTeamExists;
use App\Rules\NameTypeRule;
use App\Rules\QuizTypeRule;
use App\Rules\userIsExistsRule;

// ゲームの種類設定のリクエスト
class GamePatternRequest extends FormRequest
{

    // エラーが生じた際にjsonで返す様にする
    // 元のFormRequestの初期設定のfailedValidatonを書き換える
    protected function failedValidation(Validator $validator)
    {
        $response = response()->json([
            'message' => 'バリデーションエラーが発生しました。',
            'errors' => $validator->errors()
        ], 422);

        throw new HttpResponseException($response);
    }


     public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rule_sets=[
            //カテゴリー
            "cate"=>[
                "required",
                new ExcludeNoChoiceRule(new CategoryRule)
            ],
            // クイズ形式
            "quizType"=>[
                "required",
                new ExcludeNoChoiceRule(new QuizTypeRule),
            ],
            // 回答形式
            "nameType"=>[
                "required",
                new ExcludeNoChoiceRule(new NameTypeRule),
            ],
            // ユーザー
            "user"=>[
                "required",
                new userIsExistsRule()
            ]

            ];


            // // 回答時のみ：回答にチームが含まれるか？
            if( $this->route()->getName()==="answerCheck"
             && strpos($this->input("quizType"),"rand")!==false){
                    $rule_sets["team"]=[
                            "required",
                            new ExcludeNoChoiceRule(new isTeamExists($this->input("cate")))
                    ];
            }
        return $rule_sets;
    }
    public function messages(){
        // カスタムルールはルールクラスに設定
        return[
            "cate.required"=>"選択されていません",
            "quiz_type.required"=>"選択されていません",
            "name_type.required"=>"選択されていません",
        ];
    }
}
