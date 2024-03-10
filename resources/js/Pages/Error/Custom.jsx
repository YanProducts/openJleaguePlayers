import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Custom({ auth,message}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">トップページ</h2>}
        >
            <Head title="エラーのお知らせ" />
           <div>
              <p>{message}</p>
           </div>
        </AuthenticatedLayout>
    );
}
