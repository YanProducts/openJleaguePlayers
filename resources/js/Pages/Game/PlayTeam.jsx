import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from "react";
import { Link, Head} from '@inertiajs/react';
import backgroundImage from '../../../img/back.jpg';
import gameplay_fetch from '../fetchAPI/GamePlay_fetch';
import { AfterAnswerComponent } from './Part/AfterAnswerByTeam';
import AnswerByTeam from "./Part/ResultView/AnswerByTeam";
import PlayTeamCustomDefinition from '../Components/PlayTeamCustomDefinition';

export default function PlayTeam(props) {

    const{isAfter,answered,setAnswered,uniqueToken,setFetchReturn,error,setIsAfter,isRightState,setIsRightState,comvertingTeams,inputSets,requiredAnswer,setInputSets,nowAlreadyPlayers,openedInput,inputRefs}=PlayTeamCustomDefinition(props);

    // 回答がsubmitされたとき
    const onAnswerBtnClick=()=>{

        // 回答後の段階なら送信できない
        if(isAfter){
            return;
        }

        // チームを必要データのみに変換
        const comvertedTeams=comvertingTeams(props.teams);

        const fetch_params={
            answered: answered,
            setAnswered: setAnswered,
            inputSets:inputSets,
            player_lists: props.player_lists,
            name_type: props.name_type,
            quiz_type: props.quiz_type,
            requiredAnswer:requiredAnswer,
            teams:JSON.stringify(comvertedTeams),
            cate: props.cate,
            user:props.user.name,
            uniqueToken:uniqueToken,
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{props.cate == "all" ? "Jリーグ" : props.cate}選手当てクイズ！
            </h2>}
            pageName="PlayTeam"
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
                setInputSets={setInputSets}
                isAfter={isAfter}
                setIsAfter={setIsAfter}
                isRightState={isRightState}
                setIsRightState={setIsRightState}
                answered={answered}
                nowAlreadyPlayers={nowAlreadyPlayers}
                quiz_type={props.quiz_type}
                cate={props.cate}
            />

       <div className='text-center base_frame mb-3'>
            <button
            className={`base_btn inline-block ml-1 font-bold ${isAfter ? 'opacity-70 pointer-events-none hidden' : 'opacity-100 pointer-events-auto block'}`}  onClick={onAnswerBtnClick}>回答してみる</button>
       </div>

            {error.validationError &&(<p className='base_error animate-whenerror'>{error.validationError}</p>)}

        {/* 回答表示 */}
        <AnswerByTeam
            teams={props.teams}
            requiredAnswer={props.quiz_type.substring(4)}
            answered={answered}
            openedInput={openedInput}
            inputSets={inputSets}
            setInputSets={setInputSets}
            inputRefs={inputRefs}
            isAfter={isAfter}
        />

        <div>　</div>

        </div>
        </AuthenticatedLayout>
    );
}
