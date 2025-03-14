<?php

namespace App\Http\Requests\Auth;

// バリデーションエラーのカスタマイズ
use Illuminate\Contracts\Validation\Validator;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\userIsExistsRule;
use App\Rules\noCommonUserRule;
use Illuminate\Http\Exceptions\HttpResponseException;

// 自動ログインに対するバリデーション
class AutoLoginRequest extends FormRequest
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
            "name"=>["required", new userIsExistsRule, new noCommonUserRule],
            "rememberToken"=>"required"
        ];
    }
    public function messages(){
        // このメッセージが呼ばれるのは開発環境dけ
        return[
        "name.required"=>"オートログインの際のログイン名がありません",
        "rememberToken.required"=>"オートログインの際のログイントークンがありません",
        ];
    }

    // オートログイン処理のため、リダイレクトの際はエラー処理書き換え（開発環境でない場合は単純にログインページに飛ぶ）
    protected function failedValidation(Validator $validator){
        if(env("APP_ENV")==="production"){
            throw new HttpResponseException(redirect()->route("login"));
        }
        throw new HttpResponseException(
            redirect()->route("error_view",[
                "message"=>$validator->errors()->first()
            ])
        );
    }
}
