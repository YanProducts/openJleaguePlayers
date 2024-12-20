import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import BaseNameAndPasswordForm from './Part/BaseNameAndPasswordForm';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        // 現在の照合
        name:"",
        password:"",

        // 新しい値
        newPassword: '',
        newPassword_confirmation: '',

        token: tokenForRouting,
    });

    useEffect(() => {
        return () => {
            reset("name","password",'newPassword', 'newPassword_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('password_update_store'));
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <form onSubmit={submit}>

                <BaseNameAndPasswordForm
                    data={data}
                    setData={setData}
                    errors={errors}
                />

                <div className="mt-4">
                    <InputLabel htmlFor="newPassword" value="Password" />

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

                    <InputError message={errors.newPassword} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="newPassword_confirmation" value="Confirm Password" />

                    <TextInput
                        type="password"
                        name="newPassword_confirmation"
                        value={data.newPassword_confirmation}
                        className="mt-1 block w-full"
                        // 自動で前回の値を入れる。「新しいパスワード」はHTML側で一律にnew-password
                        autoComplete="new-password"
                        onChange={(e) => setData('newPassword_confirmation', e.target.value)}
                    />

                    <InputError message={errors.newPassword_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Reset Password
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
