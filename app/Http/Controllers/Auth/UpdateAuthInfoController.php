<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Auth\UpdateAuthInfoRequest;
use App\Http\Controllers\SessionController;
use App\Http\Requests\auth\UpdateNewInfoRequest;
use App\Models\User;
use App\Models\Result;
use App\Models\Archive;
use App\Models\User_archive;


use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

//パスワードとユーザーネームの変更
class UpdateAuthInfoController extends Controller
{
    // 変更のトップページへ
    public function viewUpdateAuthInfoTop(){
        return Inertia::render("Auth/UpdateInfo",[
            "year"=>empty(session("year")) ? date("y",time()) : session("year"),
        ]);
    }

    // どちらにするか決定
    public function decideUpdateWhichAuth(UpdateAuthInfoRequest $request){

        // ルーティングの正しさの証明に使用するtoken
        SessionController::create_sessions(["tokenForDataChange"=>bin2hex(random_bytes(32))]);

        // 実際のページへ移動(sessionはルート自体が正しいかのもの)
        switch($request->which){
            case "userName":
                return redirect()->route("username_reset");
                break;
            case "passWord":
                return redirect()->route("password_reset");
            break;
            default:
                return redirect()->route("error_view",["message"=>"値がおかしいです"]);
            break;
        }
    }

    // 変更のページへ(ユーザーネーム)
    public function viewUpdateUserNamePage()
    {
        return Inertia::render('Auth/ResetUsername', [
            // ルート用session
            'tokenForRouting' => session("tokenForDataChange"),
        ]);
    }

    // 変更のページへ(パスワード)
    public function viewUpdatePassWordPage()
    {
        return Inertia::render('Auth/ResetPassword', [
            // ルート用session
            'tokenForRouting' => session("tokenForDataChange"),
        ]);
    }


    // ルートが正しいか？
    public function routeCheck(Request $request){
        $isOk = (isset($request->tokenForRouting) && session()->has("tokenForDataChange"))
        ? $request->tokenForRouting === session("tokenForDataChange")
        : false;

        return response()->json([
            "isOk"=>$isOk
        ]);
    }


    // 実際の変更処理(ユーザーネーム)
    public function storeUpdateUserName(UpdateNewInfoRequest $request)
    {
        // 以前の名前とパスが正しいか（Authも更新されるので後に変更が必要）
        $request->current_pass_authenticate();
        $oldUserName=$request->name;
        $newUserName=$request->newUserName;


        try{
            // 一度のtransactionで以下を行う
            DB::transaction(function()use($oldUserName,$newUserName){
                // archivesとresultsとuser_archiveの訂正
                $results=Result::where("challenger","=",$oldUserName)->get();
                $user_archives=User_archive::where("user","=",$oldUserName)->get();
                $archive=Archive::where("challenger","=",$oldUserName)->get();

                $results->challenger=$newUserName;
                $user_archives->user=$newUserName;
                $archive->challenger=$newUserName;

                $results->save();
                $user_archives->save();
                $archive->save();

                // Userテーブルの変更
                $user=User::where("name","=",$oldUserName)->get();
                $user->name=$newUserName;
                $user->save();

            });
        }catch(\Throwable $e){
            // エラーの場合はエラールートへ
            return redirect()->route("error_view",["message"=>$e->getMessage()]);
        }




        // login情報(Auth)の訂正


    }


    // 実際の変更処理(パスワード)
    public function storeUpdatePassWord(UpdateNewInfoRequest $request)
    {
        Log::info(Auth::check());
        // 以前のユーザー名とパスワードが正しいか
        $request->current_pass_authenticate();
        Log::info(Auth::check());

        // 該当ユーザーのパスワードを再設定
        try{
            DB::Transaction(function()use($request){
                $user=User::where("name","=",$request->name)->first();
                // バリデーション通過後にユーザーが変更や削除した場合を考慮
                if(!$user){
                    throw ValidationException::withMessages(["name"=>"ユーザーが存在しません"]);
                }
                $user->password=Hash::make($request->newPassword);
                $user->save();
            });
        }catch(\Throwable $e){
            // エラーの場合はエラールートへ
            return redirect()->route("error_view",["message"=>$e->getMessage()]);
        }
        SessionController::create_onetime_sessions(["message"=>"変更完了しました"]);
        return redirect()->route("view_sign_page");

    }

}
