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
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

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

        // 一度のtransactionで以下を行う
        // resultとuser_archiveの訂正
        // login情報の訂正

        // 実際の変更処理

    }


    // 実際の変更処理(パスワード)
    public function storeUpdatePassWord(UpdateNewInfoRequest $request)
    {
        // 以前のユーザー名とパスワードが正しいか
        $request->current_pass_authenticate();

        // 該当ユーザーのパスワードを再設定
        try{
            DB::Transaction(function()use($request){
                $user=User::where("name","=",$request->name)->first();
                // バリデーション通過後にユーザーが変更や削除した場合を考慮
                if(!$user){
                    throw ValidationException::withMessages(["name"=>"ユーザーが存在しません"]);
                }
                $user->password=Hash::make($request->password);
                $user->save();
            });
        }catch(\Throwable $e){
            // エラーの場合はエラールートへ
            Log::info($e->getMessage());
            return redirect()->route("error_view");
        }
        SessionController::create_onetime_sessions(["message"=>"変更完了しました"]);
        return redirect()->route("view_sign_page");

        // これは何？？？ChatGPTより
        // if (Hash::needsRehash($user->password)) {
        //     $user->password = Hash::make($request->password);
        // }
        // hashの形は？
        // Modelのhiddenとcastに対応した形か？


    }

}
