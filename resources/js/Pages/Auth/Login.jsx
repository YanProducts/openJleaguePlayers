import { useEffect,useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import BaseNameAndPasswordForm from './Part/BaseNameAndPasswordForm.jsx';
import BaseFooterLinks from '../Components/BaseFooterLinks.jsx';

export default function Login({ year,isLocal }) {


        const { data, setData, post, processing, errors, reset } = useForm({
            name: '',
            password: '',
            remember: false,
            noLoginFlug:false,
        });

        // 初回のみ(前回のデータがあれば記入)
        useEffect(()=>{
            async function fetchDefaultData(){
            // sqlのrememberはAuthのログアウトで変更済みのためlocalStorageも削除
            localStorage.setItem("previousRememberToken","");

            //前回の値をセット
            // previousRememberがある場合のみ
            if (localStorage.getItem("previousLoginName") && localStorage.getItem("previousRemember")==="yes"
            ){
                setData(prevState=>({
                    ...prevState,
                    'name': localStorage.getItem("previousLoginName"),
                }));
            }
            }
          fetchDefaultData();
    },[])


    // noLoginではなく通常のログイン
    const submit = (e) => {

        e.preventDefault();

        // rememberがついていないときは自動ログインをnoにする(以前yesにしていた場合を考慮。逆にnoからyesはログイン成功後に設定)
        if(!data.remember){
            localStorage.setItem(
                "previousRemember","no",
            );
        }

        // ログイン
        post(route('login_post_route'),{
            headers:{
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
            }
        });
    };

    // ログインしないで遊ぶをクリックしたらnoLoginUserでdataを格納
    const onNoLoginClick=()=>{
        const headers={
            "Content-Type":"application/json",
            // ヘッダーで自動送信されているが、念のため行う
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        }
        fetch(
            "/login_for_common",{
                method:"POST",
                headers:headers,
                body:JSON.stringify({
                    "name":import.meta.env.VITE_COMMON_USER_NAME,
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
                Inertia.visit(`topPage/0`);
            }else{
                throw new Error(json?.validationError ?? "バリデーションエラーです");
            }
            return;
        }).catch((e)=>{

            const commonErrorMessage=isLocal==="local" ? e.message : "noLoginUserError";
            // エラーページへ
            Inertia.visit(`/error_view/?message=${encodeURIComponent(commonErrorMessage)}`);
        })
    }


    // ログイン操作
    return (
        <GuestLayout>
            <Head title="Log in" />

            <div>　</div>
                <h1 className="base_h base_h1"  id="toph1">{year}年Jリーグ<br/>選手何人言えるかな？</h1>

                <form className="mx-auto base_frame max-w-lg my-10 px-6 py-4 bg-white overflow-hidden shadow-md sm:rounded-lg" onSubmit={submit}>

                <BaseNameAndPasswordForm
                    data={data}
                    setData={setData}
                    errors={errors}
                />

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
                     ログイン
                 </PrimaryButton>
                </div>
            </form>
            <p className="base_link_p my-5"><span className="base_link" onClick={onNoLoginClick}>ログインせずに遊ぶ</span></p>

            <BaseFooterLinks partNames={["register"]}/>

        </GuestLayout>
    );
}
