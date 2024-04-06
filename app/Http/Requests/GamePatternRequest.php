<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\CategoryRule;
use App\Rules\NameTypeRule;
use App\Rules\QuizTypeRule;

// ゲームの種類設定のリクエスト
class GamePatternRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
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
        return [
            //カテゴリー
            "cate"=>[
                "required",
                new CategoryRule
            ],
            // クイズ形式
            "quiz_type"=>[
                "required",
                new QuizTypeRule
            ],
            // 回答形式
            "name_type"=>[
                "required",
                new NameTypeRule
            ]
        ];
    }
    public function messages(){
        // カスタムルールはルールクラスに設定
        return[
            "cate.required"=>"選択されていません",
            "quiz.required"=>"選択されていません",
            "name.required"=>"選択されていません",
        ];
    }
}
