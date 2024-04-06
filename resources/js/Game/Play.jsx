import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, Head } from '@inertiajs/react';

export default function Play({auth,csrf_token,post_route,retry_route,players_data,name_type,quiz_type,cate}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{cate}選手当てクイズ！</h2>}
        >
            <Head title={`${cate}選手当てクイズ`} />

            <p>知っている選手の{nama_type}を書いてください</p>


            <Link
                                href={route('answerCheck')}
                                className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                              回答！
            </Link>

            <Link
                                href={route('topPage')}
                                className="ms-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                                トップへ
            </Link>
        </AuthenticatedLayout>
    );
}
