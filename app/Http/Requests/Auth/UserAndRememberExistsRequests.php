<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

// 自動保存のnameとrememberが空白ではないかのチェック(実際にSQLの値と同じかは本体でチェック)

class UserAndRememberExistsRequests extends FormRequest
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
            "name"=>"required",
            "remember"=>"required"
        ];
    }
    public function messages(): array
    {
        return [
            "name.required"=>"データが存在しません",
            "remember.required"=>"データが存在しません",
        ];
    }
}
