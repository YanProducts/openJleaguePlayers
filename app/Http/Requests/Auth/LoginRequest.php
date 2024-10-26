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
    public function authenticate(){


        $this->ensureIsNotRateLimited();

        if (! Auth::attempt($this->only('name', 'password'), $this->boolean('remember'))) {

            RateLimiter::hit($this->throttleKey());
            throw ValidationException::withMessages([
                "password"=>"パスワードが違います"
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

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
