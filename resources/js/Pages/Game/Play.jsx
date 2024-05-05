import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, Head } from '@inertiajs/react';

export default function Play({auth,csrf_token,answer_check_route,top_page_route,players_data,name_type,quiz_type,cate}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{cate}選手当てクイズ！</h2>}
        >
            <Head title={`${cate}選手当てクイズ`} />

            <p>知っている選手の{name_type}を書いてください</p>


            <Link
                                href={answer_check_route}
                                className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                              回答！
            </Link>

            <Link
                                href={top_page_route}
                                className="ms-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                                トップへ
            </Link>
        </AuthenticatedLayout>
    );
}
