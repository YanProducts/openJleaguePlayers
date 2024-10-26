import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from '@inertiajs/inertia';
import React from "react";
import { Head, Link} from '@inertiajs/react';
import PatternChoicesSets from './Components/PatternChoicesSets';
import CustomPatternDefinition from './Components/CustomPatternDefinition';
import TopPage_fetch from "./fetchAPI/TopPage_fetch";
import AutoLoginProcedure from './Auth/AutoLoginProcedure';


export default function TopPage(props) {

    AutoLoginProcedure(props);

    // stateのセット
    const { pattern,setPattern,error,setError,onCateChange,onQuizTypeChange,onNameTypeChange} = CustomPatternDefinition(props.user?.name || "","topPage");

    // 決定ボタンが押されたとき
    const onDecideButtonClick=async (e)=>{
        e.preventDefault();

        // ここでバリデーションエラーにfetch送信
        const fetch_return=await TopPage_fetch(pattern);
        if(!fetch_return.success){
            setError(fetch_return.errorMessage)
        }else{

            // ページ遷移
            Inertia.visit("/game.play",
            {
                onError: (errors) => {
                alert('何らかのエラーでゲーム開始できませんでした');
                },

              });
            return;
        }
    }

    return (
        <AuthenticatedLayout
            user={props.auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">トップページ</h2>}
            pageName="TopPage"
        >
        <Head title="トップページ" />
        <div>
                <div className="h-200">　</div>
                <h1 className="base_h base_h1"  id="toph1">{props.year}年Jリーグ<br/>選手何人言えるかな？</h1>

                {/* validation以外の全般のエラー時に */}
                {error.unCategorizedError &&
                <p className='base_error animate-whenerror mb-5'>不明なエラーです</p>
                }

                <p className='base_frame base_backColor text-right font-bold my-3 px-3 py-1'>挑戦者：{!props?.auth?.user?.name ? "" : (props.auth.user.name === "commonUser" ? "ゲスト": props.auth.user.name)}さん</p>

                <form method="post" action="game.decide_pattern" className='base_frame font-bold'>

                {/* パターンの選択 */}
                <PatternChoicesSets
                    onCateChange={onCateChange}
                    jsonCateSets={props.cateSets}
                    onQuizTypeChange={onQuizTypeChange}
                    jsonQuizSets={props.quizSets}
                    onNameTypeChange={onNameTypeChange}
                    jsonNameSets={props.nameSets}
                    error={error}
                    pageName="topPage"
                />


                <div className='base_frame my-0'>
                    <button className='base_btn' onClick={onDecideButtonClick}>決定！</button>
                </div>
                </form>

                <div className='base_link_p mt-7 mb-2'><Link
                className='base_link' href="/logout" method="post" as="button">
                    {props?.auth?.user?.name && props.auth.user.name === "commonUser" ? "ログインして遊ぶ":"ログアウト"}
                </Link></div>

            </div>
        </AuthenticatedLayout>
        );

}
