import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from "react";
import { Link, Head} from '@inertiajs/react';
import backgroundImage from '../../../img/back.jpg';
import gameplay_fetch from '../fetchAPI/GamePlay_fetch';
import { AfterAnswerComponent } from './Part/AfterAnswerByTeam';
import AnswerByTeam from "./Part/ResultView/AnswerByTeam";

export default function PlayTeam(props) {

    // 回答され開いてliに変更されたinput要素(開いた番目のinputを挿入)と、そこに埋まる値
    const [openedInput,setOpenedInput]=React.useState({});

    // 回答に向けたinputのセット(totalのliでn番目のものと、それに対応したinputの値)
    const [inputSets,setInputSets]=React.useState({});

    // inputのref(inputRefs.currentで配列)
    const inputRefs=React.useRef({});

    // fetch後のオブジェクト格納
    const [fetchReturn,setFetchReturn]=React.useState({});

    // 回答された選手のリスト
    const [answered,setAnswered]=React.useState([]);

    // エラー有無
    const [error,setError]=React.useState({});

    // 回答後か否か
    const [isAfter,setIsAfter]=React.useState(false);

    // ２重投稿防止トークン
    const [uniqueToken,setUniqueToken]=React.useState(props.unique_token);

    // 何人正解か？
    const [isRightState,setIsRightState]=React.useState("yet");


    // 次に、fetchDoneによって変化が生じたfetchReturnの値によって変化させる分
    React.useEffect(()=>{

        // fetchReturn取得前は何もしない
        if(Object.keys(fetchReturn).length===0){
            return;
        }

        console.log(fetchReturn);

        // UI初期化(既に送信済みなのでinputは空にできる)
        // inputRef.current.value="";

        if(fetchReturn.success){
            // 新たなsessionの設定
            setUniqueToken(fetchReturn.returnSets.new_token);

            // 正解人数の表示
            // まだ！！！全員回答済だった場合！！！！！
            setIsRightState(fetchReturn.rightCounts);

        }else{
            // 失敗の場合
            // 二重投稿の場合は何もしない
            if(fetchReturn.errorMessage.unCategorizedError && fetchReturn.errorMessage.unCategorizedError
                ==="duplicated"){
                console.log("duple");
                return;
            }

            // それ以外の場合
            setError(fetchReturn.errorMessage);
        }

    },[fetchReturn])


    // その後、isRightStateに変化が生じたら、回答リストに挿入
    React.useEffect(()=>{

        // 正解の場合：選手リストに追加
        // if(isRightState==="right"){

        //     let insertAnswered=fetchReturn.returnSets.playerLists.map((eachPlayer,index)=>({
        //             "number":answered.length+index+1,
        //             "player":eachPlayer,
        //             "team":fetchReturn.returnSets.team,
        //             "red":fetchReturn.returnSets.red,
        //             "green":fetchReturn.returnSets.green,
        //             "blue":fetchReturn.returnSets.blue,
        //     }));

        //     // 挿入は１度に行う必要がある
        //     setAnswered([...answered,...insertAnswered]);
        // }

        // // 回答後画面へのフラグ(isAfter)反映
        if(isRightState!=="yet"){
            setIsAfter(true);
        }
    },[isRightState])

    // teamsには必要な要素のみを渡す
    const comvertingTeams=(teams)=>{
        return(
        teams.map((obj,key)=>({
                "id":obj.id,
                "red":obj.red,
                "green":obj.green,
                "blue":obj.blue,
                "eng_name":obj.eng_name,
                "jpn_name":obj.jpn_name,
                "cate":obj.cate
            })
        )
    )}



    // 回答がsubmitされたとき
    const onAnswerBtnClick=()=>{

        // 回答後の段階なら送信できない
        if(isAfter){
            return;
        }

        // チームを必要データのみに変換
        const comvertedTeams=comvertingTeams(props.teams);

        const fetch_params={
            csrf_token: props.csrf_token,
            answered: answered,
            setAnswered: setAnswered,
            inputSets:inputSets,
            player_lists: props.player_lists,
            name_type: props.name_type,
            quiz_type: props.quiz_type,
            requiredAnswer:props.quiz_type.substring(4),
            teams:JSON.stringify(comvertedTeams),
            cate: props.cate,
            user:props.user.name,
            uniqueToken:uniqueToken,
        };

        // 投稿
        gameplay_fetch(fetch_params).then((result)=>{
            console.log(result);
            // 投稿で返ってきた変数の格納
            setFetchReturn(result);
        })
    }

    return (
        <AuthenticatedLayout
            user={props.auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{props.cate == "all" ? "Jリーグ" : props.cate}選手当てクイズ！</h2>}>
        <Head title={`${props.cate == "all" ? "Jリーグ" : props.cate}選手当てクイズ`}/>

            <div className="custom_body pt-30" style={{ backgroundImage: `url(${backgroundImage})`,
         backgroundSize:"contain"}}>

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
            />



       <div className='text-center base_frame mb-3'>
            <button
            className={`base_btn inline-block ml-1 font-bold ${isAfter ? 'opacity-70 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}  onClick={onAnswerBtnClick}>回答してみる</button>
       </div>

            {error.validationError &&(<p id="error_cate" className='base_error animate-whenerror'>{error.validationError}</p>)}

        {/* 回答表示 */}
        <AnswerByTeam
            teams={props.teams}
            requiredAnswer={props.quiz_type.substring(4)}
            answered={answered}
            openedInput={openedInput}
            inputSets={inputSets}
            setInputSets={setInputSets}
            inputRefs={inputRefs}
        />

        <p className='base_link_p'><Link className='base_link' href="/topPage">トップへ</Link></p>

        <div>　</div>

        </div>
        </AuthenticatedLayout>
    );
}
