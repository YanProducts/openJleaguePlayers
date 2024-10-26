import { Inertia } from "@inertiajs/inertia";
import React from "react";

export default function AutoLogout({isLocal}){
    React.useEffect(()=>{

        if (isLocal === undefined || isLocal === null){
            const message="defaultSetting";
            // エラーページへリダイレクト
            Inertia.visit(`/error_view/?message=${encodeURIComponent(message)}`)
            return null;
        }
        const headers={
            "Content-type":"application/json",
            // クッキーに保存されて渡されるので不要
            // "X-CSRF-TOKEN":props.token
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
                    console.log(json)
                    throw new Error(JSON.stringify(json));
                });
            }
            return response.json();
        }).then((json)=>{
            if(json?.isOK){
                // ログアウト成功時はログイン
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
