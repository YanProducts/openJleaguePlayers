import { Inertia } from "@inertiajs/inertia";
import PasswordRetrive from './PasswordRetrieveFromStorage';

//ストレージの値があるかどうかで、loginに戻すか自動ログインかを決めるためのデータ取得
export default async function GetDataFromLocalStorage(data, setData, post){
    // ストレージの値があるかJSXでチェック

    // 自動ログインボタン(falseの場合もアウト)、自動ログインネーム、自動ログインパス、自動ログインパスキーがあるか？どれかがなければログインページへ返す
    if( localStorage.getItem("previousRemember")===null ||
      !localStorage.getItem("previousRemember") ||
      localStorage.getItem("previousRemember")==="false" ||
        localStorage.getItem("previousLoginName")===null||
        localStorage.getItem("previousEncryptedPassword")===null ||
        localStorage.getItem("previousEncryptionKey")===null
    ){
        Inertia.visit("login");
        return;
     }

        // // パスワードを複合化
        const realPass=await PasswordRetrive();

        // 各値をセット
        if(data.name===""){
            setData(prevState=>({
                ...prevState,
                'name': localStorage.getItem("previousLoginName"),
                'password':realPass,
                "fromURL":"autoLogin"
            }));
        }
}
