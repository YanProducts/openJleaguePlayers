import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';


// ログイン時のユーザー名とパスワードのjsx
export default function BaseNameAndPasswordForm({data,setData,errors}){
    return(
        <>
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
        </>
    );
}
