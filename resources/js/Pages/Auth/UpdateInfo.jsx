import GuestLayout from '@/Layouts/GuestLayout';
import { Head,useForm,Link } from '@inertiajs/react';
import Checkbox from '../../Components/Checkbox';
import PrimaryButton from '../../Components/PrimaryButton';
import React from 'react';
import { Inertia } from '@inertiajs/inertia';

// ユーザー名とパスワードのどちらを変更するか
export default function UpdateInfo({}){

        // どちらを選択するかのstate
        const [whichInfo,setWhichInfo]=React.useState("");

        // フォームの設定
        const { data, setData, post, processing, errors, reset } = useForm({
            which:whichInfo || null,
        });

        // checkBoxをクリックした時
        const handleWhichClick=(e)=>{
            if(["userName","passWord"].includes(e.target.value)){
                setWhichInfo(e.targer.value);
            }else{
                // エラーページは大げさか
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
        <Head title="Update" />

        <div>　</div>
            <h1 className="base_h base_h1"  id="toph1">{year}年Jリーグ<br/>選手何人言えるかな？</h1>

            <form className="mx-auto base_frame max-w-lg my-10 px-6 py-4 bg-white overflow-hidden shadow-md sm:rounded-lg" onSubmit={handleDecideClick}>

            <Checkbox
                name="whichInfo"
                value="userName"
                checked={whichInfo === "userName" ? true : false}
                onChange={handleWhichClick}
                />
            <Checkbox
                name="whichInfo"
                value="passWord"
                checked={whichInfo === "passWord" ? true : false}
                onChange={handleWhichClick}
            />

            <div className="flex items-center justify-end mt-4">
             <PrimaryButton className="ms-4" disabled={processing}>
                決定！
             </PrimaryButton>
            </div>
        </form>

        <p className="base_link_p">
       <Link href={route("login")} className="base_link">
                戻る
            </Link>
        </p>
    </GuestLayout>
    )
}
