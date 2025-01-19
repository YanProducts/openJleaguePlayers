import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Sign({ auth,message}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">お知らせ</h2>}
            pageName="Sign"
        >
            <Head title="お知らせ" />
           <div>　</div>
           <div>
              <p className="text-center font-bold text-xl base_backColor base_frame py-3 my-5">{!message ? "お知らせはありません" : message}</p>
           </div>
        </AuthenticatedLayout>
    );
}
