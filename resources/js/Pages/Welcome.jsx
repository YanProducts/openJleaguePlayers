import React from 'react';
import { Inertia } from "@inertiajs/inertia";
import GetDataFromLocalStorage from "./Auth/Part/GetDataFromLocalStorage";

// 「/」でアクセスされたら、1:auth、2:rememberTokenの可否に応じてページをレンダリング
export default function Welcome({auth,isLocal}){

    // 実際のログインユーザー名
    const [user,setUser]=React.useState(auth?.name || "nonSet");
    // 保持ユーザー名
    const [hojiUser,setHojiUser]=React.useState(localStorage.getItem("previousLoginName") || "nonSet");
    // ログイントークン
    const [rememberToken,setRememberToken]=React.useState(localStorage.getItem("previousRememberToken") || "nonSet");
    // 保持orNot
    const [remember,setRemember]=React.useState(localStorage.getItem("previousRemember"));


    // 1:既にログイン済みの場合はtopPageへ
    // 2:照合失敗の場合はログインページへ
    // 3:照合成功の場合はuserとrememeberTokenをセットしてtopPageへ
    React.useEffect(()=>{

        // user初期値が既に存在している場合(ログイン済)はtopPageへ
        // GetDataFromLocalStorageで変更された場合もeffectの依存配列でuserが変更されてこの場所へ
        if (user !== "nonSet") {
            Inertia.visit(`/topPage/${remember}`);
            return;
        }

        // userなし、かつrememberなし(もしくはfalse)＝ログインページへ
        if (!remember || remember ==="no" || rememberToken==="nonSet") {
           Inertia.visit("/login");
           return;
        }

        // userなし、かつrememberあり
        // tokenの照合を行いリダイレクト処理
        // 照合の処理
        GetDataFromLocalStorage(isLocal,hojiUser,user,setUser,rememberToken,setRememberToken);
    },[user,remember]);


    return null;
}
