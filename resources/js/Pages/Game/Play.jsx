import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from "react";
import { Link, Head} from '@inertiajs/react';
import backgroundImage from '../../../img/back.jpg';
import gameplay_fetch from '../fetchAPI/GamePlay_fetch';
import { InputComponent } from './Part/InputComponent';
import { AfterAnsewrComponent } from './Part/AfterAnsweComponent';
import { NowPlayingQuizResultComponent } from './Part/ResultView/NowPlayingQuizResultComponent';

export default function Play(props) {

    // 回答された選手のリスト
    const [answered,setAnswered]=React.useState([]);

    // 入力内容
    const [inputVal,setInputVal]=React.useState("");

    // エラー有無
    const [error,setError]=React.useState("");

    // 回答後か否か
    const [isAfter,setIsAfter]=React.useState(false);

    // 正解か不正解か未回答か回答済か(jsonと区別するためにStateを変数名で使用)
    const [isRightState,setIsRightState]=React.useState("yet");

    // inputのcursor
    const inputRef=React.useRef(null);

    // input要素が変化したとき
    const onInputChange=(e)=>{
        setInputVal(e.target.value)
    }

    //チーム選択によって変化
    const [answerTeam,setAnswerTeam]=React.useState("no_choice");

    // 回答がsubmitされたとき
    const onAnswerBtnClick=async (e)=>{

        e.preventDefault();

        // 回答後の段階なら送信できない
        if(isAfter){
            return;
        }

        // 入力なしなら戻る
        if(inputVal===""){
            alert("選手が入力されていません");
            return;
        }

        if(props.quiz_type.indexOf("rand")!==-1 && answerTeam==="no_choice"){
            alert("チームが入力されていません");
            return;
        }
        const fetch_params={
            csrf_token: props.csrf_token,
            answered: answered,
            setAnswered: setAnswered,
            inputVal: inputVal,
            player_lists: props.player_lists,
            name_type: props.name_type,
            quiz_type: props.quiz_type,
            answerTeam:answerTeam,
            cate: props.cate
        };
        // 投稿
        const fetch_return=await gameplay_fetch(fetch_params);

        if(fetch_return.success){

            // 正否の入力
            setIsRightState(fetch_return.returnSets.isRight);

            // 回答後の表示(正否入力が終了した後に必要)
            setIsAfter(true);

            // 正解の場合：選手リストに追加
            if(fetch_return.returnSets.isRight==="right"){
                let insertAnswered=fetch_return.returnSets.playerLists.map((eachPlayer,index)=>({
                        "number":answered.length+index+1,
                        "player":eachPlayer,
                        "team":fetch_return.returnSets.team,
                        "red":fetch_return.returnSets.red,
                        "green":fetch_return.returnSets.green,
                        "blue":fetch_return.returnSets.blue,
                }));
                // 挿入は１度に行う必要がある
                setAnswered([...answered,...insertAnswered]);
            }

            // input要素を空にしてfocus(成功でもエラーでも同じ処理)
            setInputVal("")
            // 入力はできる状態にしておく。送信はisAfterがtrueなら不可
            inputRef.current.focus();
        }else{
            // 失敗の場合
            setError(fetch_return.errorMessage)
        }

    }


    return (
        <AuthenticatedLayout
            user={props.auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{props.cate == "all" ? "Jリーグ" : props.cate}選手当てクイズ！</h2>}>
        <Head title={`${props.cate == "all" ? "Jリーグ" : props.cate}選手当てクイズ`}/>

            <div className="h-full pt-30" style={{ backgroundImage: `url(${backgroundImage})`,
         backgroundSize:"contain"}}>

            <h1 className="base_h base_h1"  id="toph1">{props.year}年{props.cate==="all" ? "J" : props.cate}リーグ<br/>選手何人言えるかな？</h1>

             {/* validation以外の全般のエラー時に */}
             {error.unCategorizedError &&
                <p className='base_error animate-whenerror mb-5'>不明なエラーです</p>
                }

            <h3 className='base_h py-1 mb-4'>知っている選手の  <span className='inline sm:hidden'><br/></span>{props.name_type}を書いてください</h3>

            {/* 正否表示 */}
            {/* クリア時のページ遷移含む */}
            <AfterAnsewrComponent
                isAfter={isAfter}
                setIsAfter={setIsAfter}
                isRightState={isRightState}
                answered={answered}
            />

            {/* input周りのcomponent */}
            <InputComponent
                props={props}
                onAnswerBtnClick={onAnswerBtnClick}
                inputRef={inputRef}
                inputVal={inputVal}
                onInputChange={onInputChange}
                answerTeam={answerTeam}
                setAnswerTeam={setAnswerTeam}
                isAfter={isAfter}

            />

            {error.validationError &&(<p id="error_cate" className='base_error animate-whenerror'>{error.validationError}</p>)}

            {/* quiz_typeがチーム別かrondomかで分割 */}
            < NowPlayingQuizResultComponent
              props={props}
              answered={answered}
            />

            <p className='base_link_p'><Link className='base_link' href="/topPage">トップへ</Link></p>

            </div>
        </AuthenticatedLayout>
    );
}
