<?php

namespace App\Http\Requests\Auth;

// バリデーションエラーのカスタマイズ
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Inertia\Inertia;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use App\Rules\noCommonUserRule;
use App\Rules\userIsExistsRule;
use Illuminate\Support\Facades\Log;

class LoginRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {

            $rule=[
                'name' => ['required', new userIsExistsRule],
                'password' => ['required', 'string'],
            ];

            // noLoginFlugがtrueか否かで分ける
            if(!$this->input("noLoginFlug")){
                $rule["name"][]=new noCommonUserRule;
            }
            return $rule;
    }

    public function messages(){
        return[
            "name.min"=>"ユーザー名は3字以上にしてください",
            "password.required"=>"パスワードは必ず入力してください",
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate($route="login"){

        // 連続的なログイン試行の制限
        $this->ensureIsNotRateLimited();

        // ログイン認証が成功するか
        if (! Auth::attempt($this->only('name', 'password'), $this->boolean('remember'))) {

            // ログイン試行回数を１つ増やす
            RateLimiter::hit($this->throttleKey());

            // 例外処理を投げて終了
            throw ValidationException::withMessages([
                "password"=>$route==="login" ? "パスワードが違います" : "以前のパスワードが違います"
            ]);
        }
        //ログイン試行回数のクリア
        RateLimiter::clear($this->throttleKey());
    }

    /**
     * @throws \Illuminate\Validation\ValidationException
     */
    // ログイン試行回数や試行間隔のエラー
    public function ensureIsNotRateLimited(): void
    {
        // 5回以上だと多すぎる試行ということで戻される
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        // 制限解除までの秒数
        $seconds = RateLimiter::availableIn($this->throttleKey());

        // 秒数を投げる
        throw ValidationException::withMessages([
            'name' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->input('name')).'|'.$this->ip());
    }


    // 失敗の場合のメソッドをオーバーロード
    protected function failedValidation(Validator $validator){

        // オートログインから到達した場合
        if($this->has("fromURL") && $this->input("fromURL")==="autoLogin"){
            return redirect()->route("login");
        }
        // それ以外は通常のバリデーションエラーハンドリング
         parent::failedValidation($validator);
    }

}
