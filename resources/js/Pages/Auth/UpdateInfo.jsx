import GuestLayout from '@/Layouts/GuestLayout';
import { Head,useForm,Link } from '@inertiajs/react';
import Checkbox from '../../Components/Checkbox';
import PrimaryButton from '../../Components/PrimaryButton';
import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import BaseFooterLinks from '../Components/BaseFooterLinks';

// ユーザー名とパスワードのどちらを変更するか
export default function UpdateInfo({year}){

        // どちらを選択するかのstate
        const [whichInfo,setWhichInfo]=React.useState("");

        // フォームの設定
        const { data, setData, post, processing, errors, reset } = useForm({
            which:whichInfo || null,
        });

        // checkBoxをクリックした時
        const handleWhichClick=(e)=>{
            if(["userName","passWord"].includes(e.target.value)){
                setWhichInfo(e.target.value);
                setData(prevState=>({
                    ...prevState,
                    "which":e.target.value
                }))
            }else{
                // エラー処理は後ほど行う
                setWhichInfo("error");
            }
        }

        // 決定ボタンをクリックした時
        const handleDecideClick=(e)=>{
            e.preventDefault();
            if(whichInfo===""){
                alert("選択されていません")
                return;
            }
            post(route("updateAuthInfoDecide"));
        }


        return(
        <GuestLayout>
        <Head title="登録データ変更" />

        <div>　</div>
            <h1 className="base_h base_h1"  id="toph1">{year}年Jリーグ<br/>選手何人言えるかな？</h1>

            <form className="mx-auto base_frame border-black border-4 rounded-md max-w-lg my-10 px-6 py-4 bg-white overflow-hidden shadow-md sm:rounded-lg" onSubmit={handleDecideClick}>

            <h2 className="base_h text-lg mb-6 mt-2  w-2/5  min-w-[200px] underline">どちらを変更しますか？</h2>

            <div className='mx-auto mt-2 mb-1 w-2/5  min-w-[200px]'>
            <Checkbox
                className='border-4 !border-black !shadow-none -translate-y-1'
                name="whichInfo"
                value="userName"
                checked={whichInfo === "userName" ? true : false}
                onChange={handleWhichClick}
                />
            <span className="ms-2 font-bold text-lg text-gray-600">ユーザーネーム</span>
            </div>

            <div className='mx-auto mt-2 mb-1 w-2/5  min-w-[200px]'>
                <Checkbox
                     className='border-4 !border-black !shadow-none -translate-y-1'
                    name="whichInfo"
                    value="passWord"
                    checked={whichInfo === "passWord" ? true : false}
                    onChange={handleWhichClick}
                />
                <span className="ms-2 font-bold text-lg text-gray-600">パスワード</span>
            </div>

            <div className="flex items-center justify-end mt-4 w-4/5 min-w-[200px]">
             <PrimaryButton className="ms-4" disabled={processing}>
                決定！
             </PrimaryButton>
            </div>
        </form>

        <BaseFooterLinks partNames={["backToLogin"]}/>
    </GuestLayout>
    )
}
