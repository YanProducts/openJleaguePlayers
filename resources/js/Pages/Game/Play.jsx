import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, {useState} from "react";
import { Link, Head } from '@inertiajs/react';
import AnswerRandom from "./Part/AnswerRandom";
import AnswerByTeam from "./Part/AnswerByTeam";
import backgroundImage from '../../../img/back.jpg';
import gameplay_fetch from '../fetchAPI/GamePlay_fetch';

export default function Play(props) {

    // 回答された選手のリスト
    const [answered,setAnswered]=React.useState([]);

    // 入力内容
    const [inputVal,setInputVal]=React.useState("");

    // エラー有無
    const [error,setError]=React.useState("");

    // inputのcursor
    const inputRef=React.useRef(null);

    // input要素が変化したとき
    const onInputChange=(e)=>{
        setInputVal(e.target.value)
    }

    //チーム選択によって変化
    const [answerTeam,setAnswerTeam]=React.useState("");

    // inputのcomponents(quiz_typeの値で変化)
    const InputComponent=()=>{
        if(props.quiz_type.indexOf("team")!==-1){
            return(
                <div className="base_input_div flex justify-center">
                <input className='h-8 ml-auto' ref={inputRef} value={inputVal} onChange={onInputChange}/>
                <button onClick={onAnswerBtnClick} className="base_btn inline-block ml-1 text-left">回答！</button>
                </div>
            )
        }else if(props.quiz_type.indexOf("rand")!==-1){

            const onTeamSelectChange=(e)=>{
                setAnswerTeam(e.target.value);
            }

            return(
                <div className="base_input_div flex justify-center">
                <input className='h-8 ml-auto mr-2' ref={inputRef} value={inputVal} onChange={onInputChange}/>
                <select value={answerTeam} className='mr-2' onChange={onTeamSelectChange}>
                    <option hidden>チームの選択</option>
                    {props.teams.map(m=>(<option key={m.id} value={m.jpn_name}>{m.jpn_name}</option>))}
                </select>
                <button onClick={onAnswerBtnClick} className="base_btn inline-block ml-1 text-left">回答！</button>
                </div>
            )
        }else{
            // エラーページへ遷移！！！！！！！



        }

    }

    // 回答ボタンを押したとき
    const onAnswerBtnClick=async ()=>{
        if(inputVal===""){
            alert("入力されていません");
            return;
        }
        const fetch_params={
            csrf_token: props.csrf_token,
            answer_check_route: props.answer_check_route,
            answered: answered,
            setAnswered: setAnswered,
            inputVal: inputVal,
            setInputVal: setInputVal,
            inputRef: inputRef,
            player_lists: props.player_lists,
            name_type: props.name_type,
            quiz_type: props.quiz_type,
            answerTeam:answerTeam,
            cate: props.cate
        };
        // 投稿
        const fetch_return=await gameplay_fetch()
        if(fetch_return.success){
            // 成功の場合

        }else{
            // 失敗の場合
            setError(fetch_return.errorMessage)
        }
    }

    // 表示する回答された選手リスト
    const quize_route_choise=()=>{
        if(props.quiz_type.indexOf("team")!==-1){
            return(
                <AnswerByTeam answered={answered} />
            )
        }else if(props.quiz_type.indexOf("rand")!==-1){
            return(
                <AnswerRandom answered={answered}/>
            )
        }else{
            // エラーページへ遷移！！！！！！！



        }
    }



    return (
        <AuthenticatedLayout
            user={props.auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{props.cate == "all" ? "Jリーグ" : props.cate}選手当てクイズ！</h2>}>
        <Head title={`${props.cate == "all" ? "Jリーグ" : props.cate}選手当てクイズ`}/>

            <div className="h-full pt-30" style={{ backgroundImage: `url(${backgroundImage})`,
         backgroundSize:"contain"}}>

            <h1 className="base_h base_h1"  id="toph1">{props.year}年Jリーグ<br/>選手何人言えるかな？</h1>

             {/* validation以外の全般のエラー時に */}
             {error.unCategorizedError &&
                <p className='base_error animate-whenerror mb-5'>不明なエラーです</p>
                }

            <h3 className='base_h py-1 mb-2'>知っている選手の{props.name_type}を書いてください</h3>

            {/* input周りのcomponent */}
            {InputComponent()}

            {error.answerValue &&(<p id="error_cate" className='base_error animate-whenerror'>{error.answerValue.join("\n")}</p>)}

            {/* quiz_typeがチーム別かrondomかで分割 */}
            {quize_route_choise()}


            <p className='base_link_p'><Link href={props.top_page_route} className='base_link'>トップへ</Link></p>

            </div>
        </AuthenticatedLayout>
    );
}
