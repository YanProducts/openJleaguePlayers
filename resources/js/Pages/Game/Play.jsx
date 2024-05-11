import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from "react";
import { Link, Head } from '@inertiajs/react';
import AnswerRandom from "./Part/AnswerRandom";
import AnswerByTeam from "./Part/AnswerByTeam";
import backgroundImage from '../../../img/back.jpg';
import gameplay_fetch from '../fetchAPI/GamePlay_fetch';
import { Inertia } from '@inertiajs/inertia';

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

    // inputのcomponents(quiz_typeの値で変化)
    const InputComponent=()=>{
        if(props.quiz_type.indexOf("team")!==-1){
            return(
                <form className="base_input_div flex justify-center" onSubmit={onAnswerBtnClick} >
                <input className='h-8 ml-auto' ref={inputRef} value={inputVal} onChange={onInputChange} />
                <button className="base_btn inline-block ml-1 text-left">回答！</button>
                </form>
            )
        }else if(props.quiz_type.indexOf("rand")!==-1){

            const onTeamSelectChange=(e)=>{
                setAnswerTeam(e.target.value);
            }

            return(
                <form className="base_input_div flex justify-center" onSubmit={onAnswerBtnClick} >
                <input className='h-8 ml-auto mr-2' ref={inputRef} value={inputVal} onChange={onInputChange}/>
                <select value={answerTeam} className='mr-2' onChange={onTeamSelectChange}>
                    <option hidden value="no_choice">チームの選択</option>
                    {props.teams.map(m=>(<option key={m.id} value={m.eng_name}>{m.jpn_name}</option>))}
                </select>
                <button className="base_btn inline-block ml-1 text-left">回答！</button>
                </form>
            )
        }else{
            // エラーページへ遷移
            Inertia.visit(props.error_view_route);
            return;
        }

    }

    // 回答がsubmitされたとき
    const onAnswerBtnClick=async (e)=>{

        e.preventDefault();

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
            answer_check_route: props.answer_check_route,
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
            // 成功の場合
            setIsAfter(true);
            // 正否の表示
            setIsRightState(fetch_return.returnSets.isRight);

            // 正解の場合：選手リストに追加
            if(fetch_return.returnSets.isRight==="right"){
                let newAnswered=[...answered];
                fetch_return.returnSets.playerLists.forEach((eachPlayer)=>{
                    newAnswered.push(
                        {
                            "number":answered.length+1,
                            "player":eachPlayer,
                            "team":fetch_return.returnSets.team,
                            "red":fetch_return.returnSets.red,
                            "green":fetch_return.returnSets.green,
                            "blue":fetch_return.returnSets.blue,
                        });
                });
                // 挿入は１度に行う必要がある
                setAnswered(newAnswered);
            }
            // input要素を空にしてfocus(成功でもエラーでも同じ処理)
            setInputVal("")
            inputRef.current.focus();
        }else{
            // 失敗の場合
            setError(fetch_return.errorMessage)
        }

    }

    // 表示する回答された選手リスト
    const quiz_route_choise=()=>{
        if(props.quiz_type.indexOf("team")!==-1){
            return(
                <AnswerByTeam answered={answered} />
            )
        }else if(props.quiz_type.indexOf("rand")!==-1){
            return(
                <AnswerRandom answered={answered}/>
            )
        }else{
            // エラーページへ遷移！
            Inertia.visit(props.error_view_route);
            return;
        }
    }

    // 回答後のUI
    const AfterAnsewrComponent=()=>{
        React.useEffect(function(){
            // クイズ回答後の場合は3秒後に疑似ページ遷移してクイズ回答前の状態にする
            if(isAfter){
                const timer=setTimeout(()=>{
                    setIsAfter(false);
                },3000)
            // useEffect内部での処理を終了後に、useEffectが発生する前の状態に戻す
                return()=>{
                    clearTimeout(timer)
                }
            }
        },[isAfter])
        if(isAfter){
            if(isRightState==="right"){
                return(
                    <div className='right_div'>正解！</div>
                    )
            }else if(isRightState==="wrong"){
                return(
                    <div className='wrong_div'>X</div>
                )
            }else if(isRightState==="already"){
                return(
                    <div className='already_div'>回答済</div>
                    )
            }
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

            <h3 className='base_h py-1 mb-2'>知っている選手の{props.name_type}を書いてください</h3>

            {/* 正否表示 */}
            {AfterAnsewrComponent()}

            {/* input周りのcomponent */}
            {InputComponent()}

            {error.validationError &&(<p id="error_cate" className='base_error animate-whenerror'>{error.validationError}</p>)}

            {/* quiz_typeがチーム別かrondomかで分割 */}
            {quiz_route_choise()}


            <p className='base_link_p'><Link href={props.top_page_route} className='base_link'>トップへ</Link></p>

            </div>
        </AuthenticatedLayout>
    );
}
