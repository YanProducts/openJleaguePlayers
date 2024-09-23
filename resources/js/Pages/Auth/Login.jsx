import { useEffect,useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import PasswordStoreToStorage from './Parts/PasswordStoreToStorage';
import PasswordRetrive from './Parts/PasswordRetrieveFromStorage';


export default function Login({ status, canResetPassword,year,noLoginPass,token,isLocal }) {

        const { data, setData, post, processing, errors, reset } = useForm({
            name: '',
            password: '',
            remember: false,
            noLoginFlug:false
        });

        // 初回のみ(前回のデータがあれば記入)
        useEffect(()=>{
            async function fetchDefaultData(){
            //前回の値をセット
            if (localStorage.getItem("previousLoginName") && localStorage.getItem("previousEncryptedPassword") &&
            localStorage.getItem("previousEncryptionKey")
            ) {
                // パスワードの取り出す
                const realPass=await PasswordRetrive();
                setData(prevState=>({
                    ...prevState,
                    'name': localStorage.getItem("previousLoginName"),
                    'password':realPass
                }));
            } else {
                setData(prevState=>({
                    ...prevState,
                    'name': "",
                    'password':""
                }));
            }
            }
          fetchDefaultData();
    },[])


    // noLoginではなく通常のログイン
    const submit = (e) => {

        e.preventDefault();

        // rememberがついている時
        // 前回までのremember値がない時
        if(data.remember || !localStorage.getItem("previousRemember")){
            // パスワードの暗号化
            // ここで暗号化されたキーとパスワードに必要な一式はローカルストレージに保存
            PasswordStoreToStorage(data.password);
            // ユーザーの名前&共通ユーザーではないという履歴
            localStorage.setItem(
                "previousLoginName",data.name,
            );
            if(data.remember){
                // rememberに追加
                localStorage.setItem(
                    "previousRemember",true,
                );
            }
        }

        // rememberの値があって、別ユーザー仕様の場合はlocalstorageに記憶させない
        if(!data.remember && localStorage.getItem("previousRemember")){
            localStorage.setItem(
                "previousRemember",false,
            );
        }


        // ログイン
        post(route('login'));
    };


    // ログインしないで遊ぶをクリックしたら、commonUserでdataを格納
    const onNoLoginClick=()=>{
        // tokenはcookieにセットされているのでheadersに加える必要ない
        const headers={
            "Content-Type":"application/json",
        }
        fetch(
            "login_for_common",{
                method:"post",
                headers:headers,
                body:JSON.stringify({
                    "name":"commonUser",
                    "password":noLoginPass,
                    "remember":false,
                    "noLoginFlug":true
                })
            }
        ).then((response)=>{
            if(!response.ok){
            // バリデーションエラー
            // 共通ユーザー設定がうまくいっていないとき
            if(response.status===422){
                throw new Error(response.json(json=>json.validationError ?? "何らかのエラーです"));
              }
            }

            return response.json()
        }).then((json)=>{
            if(json?.commonUserLogin){
                // ログイン
                Inertia.visit("topPage");
            }else{
                throw new Error(json?.validationError ?? "バリデーションエラーです");
            }
            return;
        }).catch((e)=>{
            const commonErrorMessage=isLocal==="local" ? e.message : "何らかのエラーが発生しました"
            // エラーページへ
            Inertia.visit(`error_view/${commonErrorMessage}`);
        })
    }


    // ログイン操作
    return (
        <GuestLayout>
            <Head title="Log in" />

            <div>　</div>
                <h1 className="base_h base_h1"  id="toph1">{year}年Jリーグ<br/>選手何人言えるかな？</h1>

                <form className="mx-auto base_frame max-w-lg my-10 px-6 py-4 bg-white overflow-hidden shadow-md sm:rounded-lg" onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="loginName" value="ユーザーネーム" />

                    <TextInput
                        id="loginName"
                        type="text"
                        name="name"
                        value={data.name  || ""}
                        className="mt-1 block w-full"
                        autoComplete="new-name"
                        // autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="パスワード"/>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password || ""}
                        className="mt-1 block w-full"
                        // autoCompleteを特定不明の値にする
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="block mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm font-bold text-gray-600">ログイン情報を保存する</span>
                    </label>
                </div>

                <div className="flex items-center justify-end mt-4">
                 <PrimaryButton className="ms-4" disabled={processing}>
                     Log in
                 </PrimaryButton>
                </div>
            </form>
            <p className="base_link_p my-5"><span className="base_link" onClick={onNoLoginClick}>ログインせずに遊ぶ</span></p>
            <p className="base_link_p">
                <Link href={route('register')} className="base_link">
                    新規登録はこちらから
                </Link>
            </p>
        </GuestLayout>
    );
}
