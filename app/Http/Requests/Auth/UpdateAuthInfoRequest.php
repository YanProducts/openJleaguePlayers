<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use App\Http\Controllers\SessionController;

// ユーザー名とパスワードのどちらを変更するか
class UpdateAuthInfoRequest extends FormRequest
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
            "whichInfo"=>"regex:/^[userName|passWord]$/"
        ];
    }
    public function messages(): array
    {
        return [
            "whichInfo.regex"=>"選択の値が不正です"
        ];
    }
}
