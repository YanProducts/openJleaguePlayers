import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import RouteCheck from './Part/RouteCheck';
import { Inertia } from '@inertiajs/inertia';
import {Link} from '@inertiajs/react';
import BaseNameAndPasswordForm from './Part/BaseNameAndPasswordForm';
import BaseFooterLinks from '../Components/BaseFooterLinks';

export default function ResetPassword({ tokenForRouting }) {

    const { data, setData, post, processing, errors, reset } = useForm({
        // 現在の照合
        name:"",
        password:"",

        // 新しい値
        newPassword: '',
        newPassword_confirmation: '',
    });

    // ルーティングの検証(ちゃんと前のページを通ってるか？)
    useEffect(() => {
        RouteCheck(tokenForRouting)
    }, [tokenForRouting]);

    const submit = (e) => {
        e.preventDefault();
        post("reset-password");
    };

    return (
        <GuestLayout>
            <Head title="パスワードの変更" />

            <div>　</div>

            <h1 className='base_frame base_h1 base_h border-black border-2 p-5 bg-white rounded-xl mt-5 font-bold'>パスワードの変更</h1>

            <form onSubmit={submit} className='base_frame border-black border-2 p-5 bg-gray-400 rounded-xl my-10'>

                {/* 現在のユーザー名とパスワード */}
                <BaseNameAndPasswordForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    fromPage="change"
                />

                <div className="mt-4">
                    <InputLabel htmlFor="newPassword" value="新しいパスワードspan(大文字小文字数字を含む8字以上)" />

                    <TextInput
                        id="newPassword"
                        type="password"
                        name="newPassword"
                        value={data.newPassword}
                        className="mt-1 block w-full"
                        // 自動で前回の値を入れる。「新しいパスワード」はHTML側で一律にnew-password
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData('newPassword', e.target.value)}
                    />

                    <InputError message={errors.newPassword} />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="newPassword_confirmation" value="パスワードの確認" />

                    <TextInput
                        type="password"
                        name="newPassword_confirmation"
                        value={data.newPassword_confirmation}
                        className="mt-1 block w-full"
                        // 自動で前回の値を入れる。「新しいパスワード」はHTML側で一律にnew-password
                        autoComplete="new-password"
                        onChange={(e) => setData('newPassword_confirmation', e.target.value)}
                    />

                    <InputError message={errors.newPassword_confirmation} />
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
