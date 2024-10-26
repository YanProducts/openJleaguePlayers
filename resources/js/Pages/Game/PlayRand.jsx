import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from "react";
import { Link, Head} from '@inertiajs/react';
import backgroundImage from '../../../img/back.jpg';
import gameplay_fetch from '../fetchAPI/GamePlay_fetch';
import { InputComponentOnRandom } from './Part/InputComponenOnRandom';
import { AfterAnswerComponent } from './Part/AfterAnswerRandom';
import AnswerRandom from "./Part/ResultView/AnswerRandom";
import PlayRandCustomDefinition from '../Components/PlayRandCustomDefinition';

export default function PlayRand(props) {

    const {isAfter,inputRef,answerTeamRef,answered,setAnswered,uniqueToken,setFetchReturn,error,setIsAfter,isRightState,setIsRightState}=PlayRandCustomDefinition(props)

    // 回答がsubmitされたとき
    const onAnswerBtnClick=(e)=>{
        e.preventDefault();

        // 回答後の段階なら送信できない
        if(isAfter){
            return;
        }

        // 入力なしなら戻る
        if(inputRef.current.value===""){
            alert("選手が入力されていません");
            return;
        }

        if(answerTeamRef.current.value==="no_choice"){
            alert("チームが入力されていません");
            return;
        }

        const fetch_params={
            answered: answered,
            setAnswered: setAnswered,
            inputVal: inputRef.current.value,
            player_lists: props.player_lists,
            name_type: props.name_type,
            quiz_type: props.quiz_type,
            answerTeam:answerTeamRef.current.value,
            cate: props.cate,
            user:props.user.name,
            uniqueToken:uniqueToken
        };

        // 投稿
        gameplay_fetch(fetch_params).then((result)=>{
            // 投稿で返ってきた変数の格納
            setFetchReturn(result);
        })
    }

    return (
        <AuthenticatedLayout
            user={props.auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{props.cate == "all" ? "Jリーグ" : props.cate}選手当てクイズ！</h2>}
            pageName="PlayRand"
            >
        <Head title={`${props.cate == "all" ? "Jリーグ" : props.cate}選手当てクイズ`}/>

            <div>

            <div>　</div>

            <h1 className="base_h base_h1"  id="toph1">{props.year}年{props.cate==="all" ? "J" : props.cate}リーグ<br/>選手何人言えるかな？</h1>

             {/* validation以外の全般のエラー時に */}
             {error.unCategorizedError &&
                <p className='base_error animate-whenerror mb-5'>不明なエラーです</p>
                }

            <h3 className='base_h py-1 mb-4'>知っている選手の  <span className='inline sm:hidden'><br/></span>{props.name_type}を書いてください</h3>

            {/* 正否表示 */}
            {/* クリア時のページ遷移含む */}
            <AfterAnswerComponent
                isAfter={isAfter}
                setIsAfter={setIsAfter}
                isRightState={isRightState}
                setIsRightState={setIsRightState}
                answered={answered}
                quiz_type={props.quiz_type}
            />

            {/* input周りのcomponent */}
            <InputComponentOnRandom
                props={props}
                onAnswerBtnClick={onAnswerBtnClick}
                inputRef={inputRef}
                answerTeamRef={answerTeamRef}
                isAfter={isAfter}
            />

            {error.validationError &&(<p className='base_error animate-whenerror'>{error.validationError}</p>)}

            <AnswerRandom answered={answered}/>
            <div>　</div>

            </div>
        </AuthenticatedLayout>
    );
}
