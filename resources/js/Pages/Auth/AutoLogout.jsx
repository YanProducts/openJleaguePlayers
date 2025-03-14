import { Inertia } from "@inertiajs/inertia";
import React from "react";

export default function AutoLogout({isLocal}){
    React.useEffect(()=>{

        const headers={
            "Content-type":"application/json",
            // 自動送信されているが、念のため行う
           'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content || "missingToken"
        };

        fetch("/logout",{
            method:"POST",
            headers:headers,
            body:JSON.stringify({
                "fromURL":"AutoLogout"
            })
        }).then((response)=>{
            if(!response.ok){
                return response.json().then((json)=>{
                    throw new Error(JSON.stringify(json));
                });
            }
            return response.json();
        }).then((json)=>{
            // ログアウト準備完了
            if(json?.isOK){
                // ログアウト成功時はログインページへ
                Inertia.visit("/login");
                return null;
            }else{
                throw new Error("autoLogOutJsonOkError");
            }
        }).catch((e)=>{
            const message=isLocal==="local" ? e.message :"autoLogOutJsonOkError";
            // エラーページへリダイレクト
             Inertia.visit(`/error_view/?message=${encodeURIComponent(message)}`)
            return null;
        })
    //laravelからreactは同期的に一気に変数を渡すことになるので、コンポーネントの構築終了は待った方が良いが、依存配列は空で良い
    },[]);

}
