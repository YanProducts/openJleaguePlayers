import { Inertia } from "@inertiajs/inertia";

//ストレージの値があるかどうかで、loginに戻すか自動ログインかを決めるためのデータ取得
export default async function GetDataFromLocalStorage(isLocal,hojiUser,user,setUser,rememberToken,setRememberToken){

    // 自動ログインボタン(falseの場合もアウト)、自動ログインネーム、自動ログイントークンがあるか？どれかがないもしくは初期値の場合はログインページへ
    if( !localStorage.getItem("previousRemember") ||
        localStorage.getItem("previousRemember")==="no" ||
        !hojiUser ||
        hojiUser==="nonSet" ||
        !rememberToken ||
        rememberToken==="nonSet"
    ){
        Inertia.visit("login");
        return;
     }

     const headers={
        "Content-Type":"application/json",
        // 自動送信されているが、念のため行う
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content || "missingToken",
     }

    try{
        const response=await fetch(
            "/getPassFromNameAndToken",{
                headers:headers,
                method:"POST",
                body:JSON.stringify({
                    "name":hojiUser,
                    "remember":rememberToken
                })
            })
        //  エラーの場合(バリデーション含む)
            if(!response.ok){
            throw new Error(response);
            }
            const json=await response.json();
        //  パスワード取得が失敗(nonDataと言う文字列のパスワードは作成時に弾かれるのでnonDataと言う文字列で定義OK)
            if(!json.userName || json.userName==="nonData"){
            throw new Error("データが見つかりませんでした")
            }
            // 成功の場合はlaravelでAuthがログイン状態にされている
            // React側のuserをセット
            setUser(json.userName)
            setRememberToken(rememberToken)
        }catch(e){
        //開発環境下ならエラーを表示して終了
        if(isLocal==="local"){
            console.log(e.message);
            return
        }
        // エラーの場合はログインページへ
        Inertia.visit("login");
        return;
    }
 }

