import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import backgroundImage from '../../img/back.jpg';
import { Inertia } from '@inertiajs/inertia';
import React, {useState} from "react";
import TopPage_fetch from "./fetchAPI/TopPage_fetch"

export default function TopPage({ auth,csrf_token,post_route,year,cateSets,quizSets,NameSets,play_game_route}) {

    // クイズのパターン一覧
    const [pattern,setPattern]=useState({
           cate:"no_choice",
           quizType:"no_choice",
           nameType:"no_choice",
    })

    // エラーかどうか
    const [error,setError]=useState({});

    // カテゴリー変更
    const onCateChange=(e)=>{
        setPattern({...pattern,cate:e.target.value});
    }

    // クイズタイプ変更
    const onQuizTypeChange=(e)=>{
        setPattern({...pattern,quizType:e.target.value});
    }

    // 名前タイプ変更
    const onNameTypeChange=(e)=>{
        setPattern({...pattern,nameType:e.target.value});
    }

    // 決定ボタンが押されたとき
    const onDecideButtonClick=async (e)=>{
        e.preventDefault();

        //１度リセットする（アニメーションをトリガーさせるため）
        setError({});

        // ここでバリデーションエラーにfetch送信
        // post_routeはweb.phpで変数設定済みのルーティング
        const fetch_return=await TopPage_fetch(csrf_token,post_route,pattern);
        if(!fetch_return.success){
            setError(fetch_return.errorMessage)
        }else{
            // ページ遷移
            // Inertia.visit(`${play_game_route}`)
            Inertia.visit(play_game_route)
            return;
        }
    }


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
                <h1 className="bg-white bg-opacity-80 base_h1 base_frame"  id="toph1">{year}年Jリーグ<br/>選手何人言えるかな？</h1>

                {/* validation以外の全般のエラー時に */}
                {error.unCategorizedError &&
                <p className='base_error animate-whenerror mb-5'>不明なエラーです</p>
                }


                <form method="post" action={post_route} className='base_frame font-bold'>

                <input type="hidden" name="token" value={csrf_token}/>


                <div className="base-frame bg-white bg-opacity-80  text-center mb-10">

                    <label htmlFor="cate_select">カテゴリー：</label>
                    <select className="ml-3" id="cate_select" name="cate"
                    onChange={onCateChange}>
                        <option hidden value="no_choice" className="cate_option">選択してください</option>
                        {
                            Object.entries(JSON.parse(cateSets)).map(([cate_key,value])=>{
                                return(<option value={cate_key}
                                key={cate_key}>{value}</option>)
                            })
                        }
                    </select>
                    {/* バリデーションエラー時 */}
                    {error.cate &&
                    (
                        <p id="error_cate" className='base_error animate-whenerror'>{error.cate.join("\n")}</p>
                    )
                    }
                </div>

                <div className="base-frame bg-white bg-opacity-80  text-center mb-10">
                    <label htmlFor="quizType_select">クイズ形式：</label>
                    <select className="ml-3" id="quizType_select" name="quizType"
                    onChange={onQuizTypeChange}>
                        <option hidden value="no_choice" className="quizType_option">選択してください</option>
                        {
                            Object.entries(JSON.parse(quizSets)).map(([quiz_key,value])=>{
                                return(
                                <option value={quiz_key}
                                key={quiz_key}>{value}</option>)
                            })
                        }
                    </select>
                {/* バリデーションエラー時 */}
                {error.quizType &&(
                    <p className='base_error animate-whenerror'>{error.quizType.join("\n")}</p>
                )}
                </div>

                <div className="base-frame bg-white bg-opacity-80  text-center mb-10">
                    <label htmlFor="nameType_select">　回答形式：</label>
                    <select className="ml-3" id="nameType_select" name="nameType" onChange={onNameTypeChange}>
                        <option hidden value="no_choice" className="nameType_option">選択してください</option>
                       {
                       Object.entries(JSON.parse(NameSets)).map  (([answer_key,value])=>{
                                return(
                                <option value={answer_key}
                                key={answer_key}>{value}</option>)
                       })
                     }
                    </select>
                {/* バリデーションエラー時 */}
                {error.nameType &&(
                    <p className='base_error animate-whenerror'>{error.nameType.join("\n")}</p>
                )}
                </div>


                <div className='base_frame my-0'>
                    <button className='base_btn' onClick={onDecideButtonClick}>決定！</button>
                </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
