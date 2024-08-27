import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import backgroundImage from '../../img/back.jpg';
import { Inertia } from '@inertiajs/inertia';
import React, {useState} from "react";
import TopPage_fetch from "./fetchAPI/TopPage_fetch";

export default function TopPage(props) {

    // クイズのパターン一覧
    const [pattern,setPattern]=useState({
           cate:"no_choice",
           quizType:"no_choice",
           nameType:"no_choice",
           user:props.user.name
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
        const fetch_return=await TopPage_fetch(props.csrf_token,pattern);
        if(!fetch_return.success){
            setError(fetch_return.errorMessage)
        }else{

            // ページ遷移
            Inertia.visit("/game.play",
            {
                onError: (errors) => {
                alert('Inertia visit error:', JSON.stringify(errors));
                },

                // preserveScroll: true,
                // preserveState: true
              });
            return;
        }
    }

    return (
        <AuthenticatedLayout
            user={props.auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">トップページ</h2>}
        >
        <Head title="トップページ" />
        <div className="h-full pt-30" style={{ backgroundImage: `url(${backgroundImage})`,
         backgroundSize:"contain"}}>

                <div className="h-200">　</div>
                <h1 className="base_h base_h1"  id="toph1">{props.year}年Jリーグ<br/>選手何人言えるかな？</h1>

                {/* validation以外の全般のエラー時に */}
                {error.unCategorizedError &&
                <p className='base_error animate-whenerror mb-5'>不明なエラーです</p>
                }

                <p className='base_frame base_backColor text-right font-bold my-3 px-3 py-1'>挑戦者：{props.auth.user.name === "commonUser" ? "ゲスト": props.auth.user.name}さん</p>

                <form method="post" action="game.decide_pattern" className='base_frame font-bold'>

                <input type="hidden" name="token" value={props.csrf_token}/>


                <div className="base-frame base_backColor  text-center mb-10">

                    <label htmlFor="cate_select">カテゴリー：</label>
                    <select className="ml-3" id="cate_select" name="cate"
                    onChange={onCateChange}>
                        <option hidden value="no_choice" className="cate_option">選択してください</option>
                        {
                            Object.entries(JSON.parse(props.cateSets)).map(([cate_key,value])=>{
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

                <div className="base-frame base_backColor  text-center mb-10">
                    <label htmlFor="quizType_select">クイズ形式：</label>
                    <select className="ml-3" id="quizType_select" name="quizType"
                    onChange={onQuizTypeChange}>
                        <option hidden value="no_choice" className="quizType_option">選択してください</option>
                        {
                            Object.entries(JSON.parse(props.quizSets)).map(([quiz_key,value])=>{
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

                <div className="base-frame base_backColor  text-center mb-10">
                    <label htmlFor="nameType_select">　回答形式：</label>
                    <select className="ml-3" id="nameType_select" name="nameType" onChange={onNameTypeChange}>
                        <option hidden value="no_choice" className="nameType_option">選択してください</option>
                       {
                       Object.entries(JSON.parse(props.nameSets)).map  (([answer_key,value])=>{
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

                <div className='base_link_p mt-4'><Link
                className='base_link' href="/logout" method="post" as="button">
                    {props.auth.user.name === "commonUser" ? "ログインして遊ぶ":"ログアウト"}
                </Link></div>

            </div>
        </AuthenticatedLayout>
    );
}
