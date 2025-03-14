<?php

// 結果のフル表示(whichがteamかplayer)

namespace App\Http\Requests;

// バリデーションエラーのカスタマイズ
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class FullResultsRequest extends FormRequest
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
            "which"=>["required","regex:/^(team|player)$/u"]
        ];
    }

    // ルートパラメータの値をリクエスト変数に変換
    protected function prepareForValidation()
    {
        $this->merge([
            "which"=>$this->route("which")
        ]);
    }

    // whichがteamかplayerではなかった時のルートを書き換え
    protected function failedValidation(Validator $validator){

        throw new HttpResponseException(
            redirect()->route("error_view", ["message" => "予期せぬエラーです"])
        );
    }

}
