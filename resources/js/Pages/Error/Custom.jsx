import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link,Head } from '@inertiajs/react';

export default function Custom({auth,message,top_page}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">トップページ</h2>}
        >
            <Head title="エラーのお知らせ" />
           <div className='base_frame bg-pink-300 text-lg text-red-600  font-bold my-5 py-1 text-center'>
              <p>{message}</p>
           </div>
           <p className='base_link_p'>
               <Link className="base_link" href={top_page}>戻る</Link>
           </p>
        </AuthenticatedLayout>
    );
}
