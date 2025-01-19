import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import BaseNameAndPasswordForm from './Part/BaseNameAndPasswordForm';
import BaseFooterLinks from '../Components/BaseFooterLinks';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="新規登録" />

            <div>　</div>

            <h1 className='base_frame base_h1 base_h border-black border-2 p-5 bg-white rounded-xl mt-5 font-bold'>新規登録</h1>

            <form onSubmit={submit} className='base_frame border-black border-2 p-5 bg-gray-400 rounded-xl my-10'>

                <BaseNameAndPasswordForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    fromPage="register"
                />

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="パスワード再確認" />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />

                    <InputError message={errors.password_confirmation}/>
                </div>

                <div className="flex items-center justify-end mt-4">

                    <PrimaryButton className="ms-4" disabled={processing}>
                        登録！
                    </PrimaryButton>
                </div>
            </form>
            <BaseFooterLinks partNames={["login"]} />
        </GuestLayout>
    );
}
