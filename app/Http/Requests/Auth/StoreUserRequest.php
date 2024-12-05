<?php

// 新規作成の時のルール
namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\User;
use App\Rules\noGuestRule;
use App\Rules\noCommonUserRule;
use App\Rules\OriginalPasswordRule;

class StoreUserRequest extends FormRequest
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
            'name' => ['required','string','max:100',"min:2",'unique:'.User::class,
            new noCommonUserRule,new noGuestRule],
            'password' => ['required', 'confirmed', new OriginalPasswordRule],
        ];
    }

    public function messages(): array
    {
        return [
            "name.required"=>"ユーザー名は必ず記入してください",
            "name.string"=>"ユーザー名は必ず文字で記入してください",
            "name.unique"=>"そのユーザー名は既に使用されています",
            "name.min"=>"ユーザー名は2字以上にしてください",
            "name.max"=>"ユーザー名は100字以内にしてください",
            "password.required"=>"パスワードは必ず入力してください",
            "password.confirmed"=>"パスワードが一致しません"
        ];
    }
}
