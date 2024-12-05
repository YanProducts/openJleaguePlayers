<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Auth\UpdateAuthInfoRequest;
use App\Http\Controllers\SessionController;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\auth\UpdateNewInfoRequest;
use App\Rules\OriginalPasswordRule;

//パスワードとユーザーネームの変更
class UpdateAuthInfoController extends Controller
{
    // 変更のトップページへ
    public function viewUpdateAuthInfoTop(){
        return Inertia::render("Auth/UpdateInfo");
    }

    // どちらにするか決定
    public function decideUpdateWhichAuth(UpdateAuthInfoRequest $request){

        // ルーティングの正しさの証明に使用するtoken
        SessionController::create_sessions(["tokenForDataChange"=>bin2hex(random_bytes(32))]);

        // 実際のページへ移動
        switch($request->which){
            case "userName":
                return redirect()->route("username_reset/",["token"=>session("tokenForDataChange")]);
                break;
            case "passWord":
                return redirect()->route("password_reset",["token"=>session("tokenForDataChange")]);
            break;
            default:
                return redirect()->route("error_view",["message"=>"値がおかしいです"]);
            break;
        }
    }

    // 変更のページへ(ユーザーネーム)
    public function viewUpdateUserNamePage(Request $request)
    {
        return Inertia::render('Auth/ResetUsername', [
            // このroute("tokenForRouting")はパラメータで渡された値。
            'tokenForRouting' => $request->route('tokenForRouting'),
        ]);
    }

    // 変更のページへ(パスワード)
    public function viewUpdatePassWordPage(Request $request)
    {
        return Inertia::render('Auth/ResetUsername', [
            // このroute("tokenForRouting")はパラメータで渡された値。
            'tokenForRouting' => $request->route('tokenForRouting'),
        ]);
    }



    // 実際の変更処理(ユーザーネーム)
    public function storeUpdateUserName(UpdateNewInfoRequest $request)
    {
        // 以前のユーザー名とパスワードが正しいか
        $request->current_pass_authenticate();
        // 実際の変更処理

    }


    // 実際の変更処理(パスワード)
    public function storeUpdatePassWord(UpdateNewInfoRequest $request)
    {
        // 以前のユーザー名とパスワードが正しいか
        $request->current_pass_authenticate();


        // 次に今回の情報のバリデーション
        $request->validate([
            'token' => 'required',
            'nwePassword' => ['required', 'confirmed', new OriginalPasswordRule],
        ]);


        $status = Password::reset(
            $request->only('password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        // // If the password was successfully reset, we will redirect the user back to
        // // the application's home authenticated view. If there is an error we can
        // // redirect them back to where they came from with their error message.
        // if ($status == Password::PASSWORD_RESET) {
        //     return redirect()->route('login')->with('status', __($status));
        // }

        // throw ValidationException::withMessages([
        // ]);
    }

}
