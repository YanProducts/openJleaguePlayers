import React from 'react';
import { Inertia } from "@inertiajs/inertia";

// 「/」でアクセスされたら、1:auth、2:rememberTokenの可否に応じてページをレンダリング
export default function Welcome({auth,isLocal}){

    // 1:既にログイン済みの場合はtopPageへ
    // 2:そうでない場合はログインページへ
    // オートログイン機能はトップページのみに持たせる
    React.useEffect(()=>{

        // user初期値が既に存在している場合(ログイン済)はtopPageへ
        if (auth?.name) {
            Inertia.visit(`/topPage`);
            return;
        }else{
             Inertia.visit(`/login`);
             return;
         }
    },[]);


    return null;
}
