import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from '@inertiajs/inertia';
import React from "react";
import { Head, Link} from '@inertiajs/react';
import PatternChoicesSets from './Components/PatternChoicesSets';
import TopPageCustomDefinition from './Components/TopPageCustomDefinition';
import TopPage_fetch from "./fetchAPI/TopPage_fetch";


export default function TopPage(props) {

    // ユーザー名
    const [user,setUser]=React.useState(props?.user || "");
    // ログイントークン
    const [rememberToken,setRememberToken]=React.useState("");
    // 保持orNot
    const [remember,setRemember]=React.useState(props?.remember || localStorage.getItem("remember") || "no");


    // ログインページから来て、新たに「保持か否か」が変更になった場合
    React.useEffect(()=>{
        // props.rememberがtrueの場合は、ストレージの値を変更
        // データ引き渡しの際に文字列に変更されていた場合も考慮
        // 手動でtopPage/1と行われても、結局は照合される必要あるから大きな差はない
        if (props.remember === 1 || props.remember === "1" || props.remember === true) {
            localStorage.setItem("previousRemember", "yes");
        }
    },[props.remember])


    // 1:ログインされていない場合はWelcomeへ(そこでオートログインも作動)
    // ログインされら場合はtokenの再設定(rememberに関わらず)
    React.useEffect(()=>{
        // user初期値が既に存在している場合(ログイン済)は返す(undefined=設定前)でも返される
        if (user === "") {
            Intertia.visit("/");
            return;
        }

        // userがcommonUserではない場合、と新しいトークンと新しい名前のローカルストレージへのセット(rememberに関わらず行う)
        if(user!=="commonUser"){
            // ここまで来ているということは、必ずnewTokenは存在する
            localStorage.setItem("previousRememberToken",props?.newToken || null)
        }
    },[user]);


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

                <p className='base_frame base_backColor text-right font-bold my-3 px-3 py-1'>挑戦者：{user ? user : (props.auth.user.name === "commonUser" ? "ゲスト": "")}さん</p>

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

                <div className='base_link_p mt-7 mb-2'>
                    <Link
                    className='base_link' href="/logout" method="post" as="button">
                        {user && props.auth.user.name === "commonUser" ? "ログインして遊ぶ":"ログアウト"}
                    </Link>
                </div>

            </div>
        </AuthenticatedLayout>
        );

}
