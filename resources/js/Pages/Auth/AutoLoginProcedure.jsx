import React from 'react';
import { useForm } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import GetDataFromLocalStorage from './Part/GetDataFromLocalStorage'

// オートログインの一連の流れ
export default function AutoLoginProcedure(props){

 // autoLogin用のuseForm
 const { data, setData, post, processing, errors, reset } =useForm({
    name: '',
    password: '',
    fromURL:"autoLogin",
    remember: false,
    noLoginFlug:false
});

// // 自動ログイン用のデータ設定(データがない場合は、この途中でtopにredirect)
React.useEffect(()=>{
    if(props.user===null ||props.user===undefined){
      GetDataFromLocalStorage(data, setData, post)
    }
},[props]);

// 上記でデータが設定されたら、ログイン用のデータからpost
React.useEffect(()=>{
    // dataのnameがないとき＝未設定のとき
    if(data.name===""){
        return;
    }
    // dataのnameが取得された後loginルートへポスト
    post(route('login'),{
        // ログイン認証不可だった場合
        onError:()=>{
            Inertia.visit("login");
        },
        // 自動ログイン成功した場合
        onFinish:()=>{
            return;
    }});
},[data])


}
