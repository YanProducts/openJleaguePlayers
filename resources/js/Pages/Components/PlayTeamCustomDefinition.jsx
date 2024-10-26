import React from "react";

export default function PlayTeamCustomDefinition(props){


    // 必要な回答数
    const requiredAnswer=props.quiz_type.substring(4);

    // 回答され開いてliに変更されたinput要素(開いた番目のinputを挿入)と、そこに埋まる値
    const [openedInput,setOpenedInput]=React.useState({});

    // 回答に向けたinputのセット(totalのliでn番目のものと、それに対応したinputの値)
    const [inputSets,setInputSets]=React.useState({});

    // inputのref(inputRefs.currentで配列)
    const inputRefs=React.useRef({});

    // fetch後のオブジェクト格納
    const [fetchReturn,setFetchReturn]=React.useState({});

    // 回答された選手のリスト(チームをキーに、選手リストをオブジェクトにして使用)
    const [answered,setAnswered]=React.useState([]);

    // エラー有無
    const [error,setError]=React.useState({});

    // 回答後か否か
    const [isAfter,setIsAfter]=React.useState(false);

    // ２重投稿防止トークン
    const [uniqueToken,setUniqueToken]=React.useState(props.unique_token);

    // 何人正解か？
    const [isRightState,setIsRightState]=React.useState("first");

    // 重複回答になった選手たち
    const [nowAlreadyPlayers,setNowAlreadyPlayers]=React.useState([]);

    // fetchの際のteamsには必要な要素のみを渡す
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




    // fetch後①：fetchDoneによって変化が生じたfetchReturnの値によって変化させる分
    React.useEffect(()=>{

        // fetchReturn取得前は何もしない
        if(Object.keys(fetchReturn).length===0){
            return;
        }

        // UI初期化(既に送信済みなのでinputは空にできる)
        // inputRef.current.value="";

        if(fetchReturn.success){
            // 新たなsessionの設定
            setUniqueToken(fetchReturn.returnSets.new_token);

            // 正解人数の表示
            // まだ！！！全員回答済だった場合！！！！！
            setIsRightState(fetchReturn.returnSets.rightCounts);

            // 今回の回答における回答済リストに入れる
            setNowAlreadyPlayers(fetchReturn.returnSets.returnedNowAnswerAleradyLists);

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


    // fetch後②：isRightStateが変更した後で、正解者をリストに捕捉する
    React.useEffect(()=>{

        // 最初のレンダリング時、また回答後に切り替わった画面では進ませない
            if(isRightState=="first" || isRightState=="yet"){
                return;
            }

            // 数値かどうかをまずチェック
            if(isNaN(Number(isRightState))){
                // 数値でない場合
                // // 回答後画面へのフラグ(isAfter)反映=エラー
                setIsAfter(true);
                return;
            }

            // 正解人数が0の場合はそのままsetIsAfterへ
            if(isRightState==0){
                setIsAfter(true);
                return;
            }

            const afterFetchLists=fetchReturn.returnSets.returnedLists;

            // 正解者の格納
            Object.keys(afterFetchLists).forEach((team)=>{
                let list=afterFetchLists[team];
                // チームごとに回答済リストに格納
                if(Object.keys(answered).includes(team)){
                    setAnswered(prevState=>({
                        ...prevState,
                        [team]:[...answered[team],...list.players]
                    }))
                }else{
                    setAnswered(prevState=>({
                        ...prevState,
                        [team]:[...list.players]
                     })
                    )
                }
            })
    },[isRightState])


    // fetch後③：answeerd変化が生じたら、UIの変更
    React.useEffect(()=>{

        // 数値かどうかをチェック
        if(isNaN(Number(isRightState))){
            // 数値でない場合
            return;
        }


        // 回答されたリストを見て、チームごとに空いている番号を取得
        // 非同期対策必要！！！！！
        let beforeOpenenLiInput={};
        Object.keys(answered).forEach((teamFromAnswered)=>{
            // 開ける場所を決定
            props.teams.forEach((teamFromProps,index)=>{
                let answerNumberByTeam=0;
                if(teamFromProps.jpn_name===teamFromAnswered){
                    for(let n=index*requiredAnswer;n<(index+1)*requiredAnswer;n++){
                        // 既に空いていたら次へ
                        if(Object.keys(openedInput).includes(n)){
                            continue;
                        }
                        // 空いていない番号から順に、openenInputに入れていく
                        beforeOpenenLiInput={
                            ...beforeOpenenLiInput,
                            [n]:answered[teamFromAnswered][answerNumberByTeam]
                        }
                        answerNumberByTeam++;
                        if(answerNumberByTeam>=(answered[teamFromAnswered].length || answerNumberByTeam >= requiredAnswer)){
                            break;
                        }
                    }
                }
            })
        })
        // 開ける
        setOpenedInput(beforeOpenenLiInput);

        // // 回答後画面へのフラグ(isAfter)反映
        if(isRightState!=="yet"){
            setIsAfter(true);
        }
    },[answered])


    return{isAfter,answered,setAnswered,uniqueToken,setFetchReturn,error,setIsAfter,isRightState,setIsRightState,comvertingTeams,inputSets,requiredAnswer,setInputSets,nowAlreadyPlayers,openedInput,inputRefs};

}
