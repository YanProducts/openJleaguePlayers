import { Inertia } from "@inertiajs/inertia";
import React from "react";
import { useForm } from "@inertiajs/react";

// ログアウト状態から、自動ログインでトップページに移動
export default function AutoLogin(){


    // データを設定
    const {data,setData,post,processing,errors,reset}=useForm({
        name:"",
        rememberToken:""
    });


    React.useEffect(()=>{
        // ローカルストレージに保存されていなければログインページへ
        if(!localStorage.getItem("previousLoginName") || !localStorage.getItem("previousRememberToken") ||!localStorage.getItem("previousRemember") ||
        localStorage.getItem("previousRemember")!=="yes"){
            Inertia.visit("/login");
            return;
        }


        setData({
        name:localStorage.getItem("previousLoginName"),
        rememberToken:localStorage.getItem("previousRememberToken")
        })
    },[])


    React.useEffect(()=>{

        // 未設定の際は戻る
        if(!data.name || !data.rememberToken){
            return;
        }

        // 投稿
        post("/autoLogin",{
            headers:{
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
            }
        })
    },[data.name,data.remember])


    // 何も返さない
    return null;
}