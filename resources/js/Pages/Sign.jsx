import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Sign({ auth,message}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">お知らせ</h2>}
        >
            <Head title="お知らせ" />
           <div className="h-full bg-green-300">
              <p className="text-center pt-10 font-bold text-lg">{!message ? "お知らせはありません" : message}</p>
              <p className="text-center mt-5"><a className="underline text-blue-400=" href={route("topPage")}>トップページへ</a></p>
           </div>
        </AuthenticatedLayout>
    );
}
