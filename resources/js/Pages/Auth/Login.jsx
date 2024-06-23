import { useEffect,useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword,noLoginPass }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);


    const submit = (e) => {
        e.preventDefault();
        // ログイン
        post(route('login'));
    };


    // Commonユーザーがセットされたかの確認
    const [commonFlug,setCommonFlug]=useState(false);
    useEffect(()=>{
        if(commonFlug){
            post(route('login'));
        }
        return setCommonFlug(false);
    },[data])

    // ログインしないで遊ぶ
    const onNoLoginClick=()=>{
        setData({
            "name":"commonUser",
            "password":noLoginPass,
            "remember":false
        });
        setCommonFlug(true);
    }

    // ログイン操作

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="loginName" value="ユーザーネーム" />

                    <TextInput
                        id="loginName"
                        type="text"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
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
                        <span className="ms-2 text-sm text-gray-600">Remember me</span>
                    </label>
                </div>

                <div className="flex items-center justify-end mt-4">
                 <PrimaryButton className="ms-4" disabled={processing}>
                     Log in
                 </PrimaryButton>
                </div>
            </form>
            <p className="base_link_p"><span className="base_link" onClick={onNoLoginClick}>ログインせずに遊ぶ</span></p>
            <p className="base_link_p">
                <Link href={route('register')} className="base_link">
                    新規登録はこちらから
                </Link>
            </p>
        </GuestLayout>
    );
}
