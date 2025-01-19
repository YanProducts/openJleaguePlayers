<?php

namespace App\Http\Requests\auth;

use App\Http\Requests\Auth\LoginRequest;
use App\Rules\noCommonUserRule;
use App\Rules\noGuestRule;
use App\Rules\OriginalPasswordRule;
use App\Rules\userIsExistsRule;
use Illuminate\Foundation\Http\FormRequest;
use App\Models\User;

// ユーザーネームもしくはパスワードの変更に際するリクエスト
class UpdateNewInfoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // ルート名が想定外の時はそもそも許可しない
        $route_name=$this->route()->getName();
        return in_array($route_name,["username_update_store","password_update_store"]);
    }


    public function rules(): array
    {
        // 共通(以前の名前とパス)
        $rule=[
            'name' => ['required', new userIsExistsRule],
            'password' => ['required', 'string'],
        ];

        // ルート名の取得
        $route_name=$this->route()->getName();

        // それぞれのルートごとの条件
        $specific_rule=match($route_name){
           "username_update_store"=>[
            'newName' => ['required','string','max:100',"min:2",'unique:'.User::class,
            new noCommonUserRule,new noGuestRule],
           ],
           "password_update_store"=>[
               "newPassword"=>['required', 'confirmed', new OriginalPasswordRule]
           ],
        //   既にauthorizeで弾いている
           default=>[]
        };

        return array_merge($rule,$specific_rule);
    }
    public function messages(): array
    {
        return [
            "name.required"=>"現在のユーザー名が入力されていません",
            "password.required"=>"現在のパスワードが入力されていません",
            "newName.required"=>"ユーザー名は必ず記入してください",
            "newName.unique"=>"そのユーザー名は既に使用されています",
            "newName.string"=>"ユーザー名は文字で記入してください",
            "newName.min"=>"ユーザー名は2字以上にしてください",
            "newName.max"=>"ユーザー名は100字以内にしてください",
            "newPassword.required"=>"パスワードは必ず入力してください",
            "newPassword.confirmed"=>"パスワードが一致しません"
        ];
    }

    // 以前のユーザー名とパスワードが正しいか？
    public function current_pass_authenticate(){
        // ログインリクエストの呼び出し
        $login_request=app(LoginRequest::class);
        // 記入された以前の名前とパスのリクエストをマージ
        $login_request->merge([
            "name"=>$this->input("name"),
            "password"=>$this->input("password")
        ]);
        // 以前の名前とパスが正しいか（この内部のAuth::attemptでAuth自体も更新される）
        $login_request->authenticate("update");
    }

}
