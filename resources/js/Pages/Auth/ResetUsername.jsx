import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import RouteCheck from './Part/RouteCheck';
import BaseNameAndPasswordForm from './Part/BaseNameAndPasswordForm';
import BaseFooterLinks from '../Components/BaseFooterLinks';

export default function ResetUserName({ tokenForRouting}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        // 現在の照合
        name:"",
        password:"",

        // 新しい値
        newUserName:""
    });

        // ルーティングの検証(ちゃんと前のページを通ってるか？)
        useEffect(() => {
            RouteCheck(tokenForRouting)
        }, [tokenForRouting]);

    const submit = (e) => {
        e.preventDefault();
        post('reset-username');
    };

    return (
        <GuestLayout>
            <Head title="ユーザーネーム変更" />

            <div>　</div>

            <h1 className='base_frame base_h1 base_h border-black border-2 p-5 bg-white rounded-xl mt-5 font-bold'>ユーザー名の変更</h1>

            <form onSubmit={submit} className='base_frame border-black border-2 p-5 bg-gray-400 rounded-xl my-10'>

                {/* 現在のユーザー名とパスワード */}
                <BaseNameAndPasswordForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        fromPage="change"
                    />

                <div className="mt-4">
                    <InputLabel htmlFor="newLoginName" value="新しいユーザーネームspan(2~100文字)" />

                    <TextInput
                        id="newLoginName"
                        type="text"
                        name="newUserName"
                        value={data.newUserName  || ""}
                        className="mt-1 block w-full"
                        autoComplete="newUserName"
                        isFocused={true}
                        onChange={(e) => setData('newUserName', e.target.value)}
                    />

                    <InputError message={errors.newUserName}/>
                </div>

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ms-4" disabled={processing}>
                            決定
                    </PrimaryButton>
                </div>
            </form>
            <BaseFooterLinks partNames={["login"]} />
        </GuestLayout>
    );
}
