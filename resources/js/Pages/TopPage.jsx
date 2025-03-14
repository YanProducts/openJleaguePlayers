import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from '@inertiajs/inertia';
import React from "react";
import { Head, Link} from '@inertiajs/react';
import PatternChoicesSets from './Components/PatternChoicesSets';
import TopPageCustomDefinition from './Definitions/TopPageCustomDefinition';
import TopPage_fetch from "../API/FetchAPI/TopPageFetch";




export default function TopPage(props) {

    // ユーザー名
    const [user,setUser]=React.useState(props?.user || "");
    // const [user,setUser]=React.useState("");
    // ログイントークン
    const [rememberToken,setRememberToken]=React.useState("");
    // 保持orNot
    const [remember,setRemember]=React.useState(props?.remember || localStorage.getItem("remember") || "no");

    const noLoginUserName=import.meta.env.VITE_COMMON_USER_NAME;

    // ログインページから来て、新たに「保持か否か」が変更になった場合
    React.useEffect(()=>{

        // user初期値が存在しない場合はログインページへ(constで設定されているのでundefinedにはならない)
        if (user === "") {
            Inertia.visit("/login");
            return;
        }
        
        // userが共通ユーザーではなく、rememberがyesの時は、新しいトークンと新しい名前のローカルストレージへのセット
        if(user!==noLoginUserName){
            if (props.remember === "yes") {
                localStorage.setItem("previousLoginName",user);
                // ユーザーをセット
                localStorage.setItem("previousRemember", "yes");
            }
            // newTokenは共通ユーザーではない場合、いずれの場合もセット(毎回更新され、かつtopPageに自動的に入った場合を考慮)
            localStorage.setItem("previousRememberToken",props?.newToken || null)
        }
    },[props.remember,user])





    // stateのセット
    const { pattern,setPattern,error,setError,onCateChange,onQuizTypeChange,onNameTypeChange} = TopPageCustomDefinition(user|| "","topPage");

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
            user={user}
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

                <p className='base_frame base_backColor text-right font-bold my-3 px-3 py-1'>挑戦者：{user ?  (user === noLoginUserName ? "ゲスト":user) : ""}さん</p>

                <form method="post" action="/game.decide_pattern" className='base_frame font-bold'>

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

                <div className='mt-7 mb-2'>
                    <p className='base_link_p'>
                        <Link
                        className='base_link' href="/logout" method= "post" as="button">

                            {user && props.auth.user.name === import.meta.env.VITE_COMMON_USER_NAME ? "ログインして遊ぶ":"ログアウト"}
                        </Link>
                     </p>
                    {user && props.auth.user.name !== noLoginUserName ?
                      <p className="base_link_p"><Link className='base_link' href="/myPage" as="button">マイページへ</Link></p> : null}
                </div>

            </div>
        </AuthenticatedLayout>
        );

}
