import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import backgroundImage from '../../img/back.jpg';

export default function TopPage({ auth,csrf_token}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">トップページ</h2>}
        >
            <Head title="トップページ" />
            <div className="h-full pt-30" style={{ backgroundImage: `url(${backgroundImage})`,
            backgroundSize:"contain"
            }}>
                <div className="h-200">　</div>
                <h1 className="bg-white bg-opacity-80 base_h1 base_frame"  id="toph1">...年Jリーグ<br/>選手何人言えるかな？</h1>

                <form id="cate_type_choice" method="post" action="" className="base_frame font-bold">
                
                <input type="hidden" name="token" value={csrf_token}/>


                <div className="base-frame bg-white bg-opacity-80  text-center mb-10">

                    <label htmlFor="cate_select">カテゴリー：</label>
                    <select className="ml-3" id="cate_select" name="cate">
                        <option hidden value="no_choice" className="cate_option">選択してください</option>
                        <option value="j1" className="cate_option">J1</option>
                        <option value="j2" className="cate_option">J2</option>
                        <option value="j3" className="cate_option">J3</option>
                        <option value="all" className="cate_option">全て</option>
                    </select>
                </div>

                <div className="base-frame bg-white bg-opacity-80  text-center mb-10">
                    <label htmlFor="quizType_select">クイズ形式：</label>
                    <select className="ml-3" id="quizType_select" name="quizType">
                        <option hidden value="no_choice" className="quizType_option">選択してください</option>
                        <option value="team1" className="quizType_option">チーム1人ずつ</option>
                        <option value="team3" className="quizType_option">チーム3人ずつ</option>
                        <option value="team5" className="quizType_option">チーム5人ずつ</option>
                        <option value="team11" className="quizType_option">チーム11人ずつ</option>
                        <option value="team20" className="quizType_option">チーム20人ずつ</option>
                        <option value="rand20" className="quizType_option">ランダム20人</option>
                        <option value="rand50" className="quizType_option">ランダム50人</option>
                        <option value="rand100" className="quizType_option">ランダム100人</option>
                        <option value="rand200" className="quizType_option">ランダム200人</option>
                    </select>
                </div>

                <div className="base-frame bg-white bg-opacity-80  text-center mb-10">
                    <label htmlFor="nameType_select">　回答形式：</label>
                    <select className="ml-3" id="nameType_select" name="nameType">
                        <option hidden value="no_choice" className="nameType_option">選択してください</option>
                        <option value="part" className="nameType_option">登録名の一部</option>
                        <option value="full" className="nameType_option">登録名</option>
                    </select>
                </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
