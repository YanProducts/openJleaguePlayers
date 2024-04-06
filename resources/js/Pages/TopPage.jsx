import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import backgroundImage from '../../img/back.jpg';
import { Inertia } from '@inertiajs/inertia';
import React, {useState} from "react";

export default function TopPage({ auth,csrf_token,post_route,year,play_game_route}) {

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

    const onDecideButtonClick=(e)=>{
        e.preventDefault();
        const headers=new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRF-TOKEN': csrf_token
        });
        // ここでバリデーションエラーにfetch送信
        // post_routeはweb.phpで変数設定済みのルーティング
        fetch(
            post_route,
            {
                method:"post",
                headers:headers,
                body:new URLSearchParams(pattern)
            }
            ).then((response)=>{
                if(!response.ok){
                    // もしバリデーションだった場合
                    if(response.status===422){
                        return response.json().then(returnedError=>{
                            setError(returnedError.errors);
                        })
                    }else{
                    // そうでない場合のエラー処理
                        return response.json().then(returnedError=>{
                            setError({
                                "unCategorizedError":"不明な処理です"
                            })
                            // catchに行く
                            throw new Error(returnedError.message)
                        })
                    }
                }
                return response.json();
        }).then((json)=>{
            console.log(json)
            // ページ遷移
            // Inertia.visit(`${play_game_route}?option=${encodeURLComponent(JSON.stringify(pattern))}`)
        }).catch((error)=>{
            // エラーの場合の処理
            console.log(error.message)
        })

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
                <p>不明なエラーです</p>
                }

                <form method="post" action={post_route} className='base_frame font-bold'>

                <input type="hidden" name="token" value={csrf_token}/>


                <div className="base-frame bg-white bg-opacity-80  text-center mb-10">

                    <label htmlFor="cate_select">カテゴリー：</label>
                    <select className="ml-3" id="cate_select" name="cate"
                    onChange={onCateChange}>
                        <option hidden value="no_choice" className="cate_option">選択してください</option>
                        <option value="J1" className="cate_option">J1</option>
                        <option value="J2" className="cate_option">J2</option>
                        <option value="J3" className="cate_option">J3</option>
                        <option value="all" className="cate_option">全て</option>
                    </select>
                    {/* バリデーションエラー時 */}
                    {error.errors?.cate &&(
                    <p>{error.errors.cate.join("\n")}</p>
                    )}


                </div>

                <div className="base-frame bg-white bg-opacity-80  text-center mb-10">
                    <label htmlFor="quizType_select">クイズ形式：</label>
                    <select className="ml-3" id="quizType_select" name="quizType"
                    onChange={onQuizTypeChange}>
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
                {/* バリデーションエラー時 */}
                {error.errors?.quizType &&(
                    <p>{error.errors.quizType.join("\n")}</p>
                )}

                <div className="base-frame bg-white bg-opacity-80  text-center mb-10">
                    <label htmlFor="nameType_select">　回答形式：</label>
                    <select className="ml-3" id="nameType_select" name="nameType" onChange={onNameTypeChange}>
                        <option hidden value="no_choice" className="nameType_option">選択してください</option>
                        <option value="part" className="nameType_option">登録名の一部</option>
                        <option value="full" className="nameType_option">登録名</option>
                    </select>
                </div>
                {/* バリデーションエラー時 */}
                {error.errors?.nameType &&(
                    <p>{error.errors.nameType.join("\n")}</p>
                )}


                <div className='base_frame my-0'>
                    <button className='base_btn' onClick={onDecideButtonClick}>決定！</button>
                </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
