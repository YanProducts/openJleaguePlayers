import React from "react";

export default function PlayRandCustomDefinition(props){

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

    // 正解か不正解か未回答か回答済か(jsonと区別するためにStateを変数名で使用)
    const [isRightState,setIsRightState]=React.useState("yet");

    // inputとselectの要素取得
    // fetch時点で最新のものを取得するため、valueもここから取得する
    const inputRef=React.useRef(null);
    const answerTeamRef=React.useRef(null);


        // 次に、fetchDoneによって変化が生じたfetchReturnの値によって変化させる分
        React.useEffect(()=>{

            // fetchReturn取得前は何もしない
            if(Object.keys(fetchReturn).length===0){
                return;
            }

            // UI初期化(既に送信済みなのでinputは空にできる)
            inputRef.current.value="";
            // 入力はできる状態にしておく。送信はisAfterがtrueなら不可
            inputRef.current.focus();

            if(fetchReturn.success){
                // 新たなsessionの設定
                setUniqueToken(fetchReturn.returnSets.new_token);
                // 正否の入力
                setIsRightState(fetchReturn.returnSets.isRight);
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
        if(isRightState==="right"){

            let insertAnswered=fetchReturn.returnSets.playerLists.map((eachPlayer,index)=>({
                    "number":answered.length+index+1,
                    "player":eachPlayer,
                    "team":fetchReturn.returnSets.team,
                    "red":fetchReturn.returnSets.red,
                    "green":fetchReturn.returnSets.green,
                    "blue":fetchReturn.returnSets.blue,
            }));

            // 挿入は１度に行う必要がある
            setAnswered([...answered,...insertAnswered]);
        }

        // 回答後画面へのフラグ(isAfter)反映
        if(isRightState!=="yet"){
            setIsAfter(true);
        }

    },[isRightState])

    return{isAfter,inputRef,answerTeamRef,answered,setAnswered,uniqueToken,setFetchReturn,error,setIsAfter,isRightState,setIsRightState};
}
