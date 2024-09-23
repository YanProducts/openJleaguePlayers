// 回答ボタンを押した後に回答チェック
export default async function gameplay_fetch(props){
    //fetchのヘッダー
    const headers=new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
    });

    // 投稿
    try{

        // answerとteamはquizTypeで分ける
        let userAnswer=(props.quiz_type).indexOf("rand")===0 ? props.inputVal : JSON.stringify(props.inputSets);
        let choicedTeam=(props.quiz_type).indexOf("rand")===0 ? props.answerTeam : props.teams;

        // quizTypeがチームの時は、「チームごとに答える人数」をセット
        let requiredAnswer=props.requiredAnswer ?? "";

       const response=await fetch(
            "/game/answerCheck",
            {
                method:"post",
                headers:headers,
                body:new URLSearchParams({
                    answer:userAnswer,
                    quizType:props.quiz_type,
                    requiredAnswer:requiredAnswer,
                    nameType:props.name_type==="名前の一部" ? "part" : (props.name_type==="登録名" ? "full":""),
                    // teamごとの場合は複数ではある
                    team:choicedTeam,
                    cate:props.cate,
                    user:props.user,
                    answered:JSON.stringify(props.answered),
                    unique_token:props.uniqueToken
                })
          });

        if(!response.ok){
            if(response.status===422){
                // バリデーションエラー
                throw new Error(JSON.stringify({"validationError":"予期せぬエラーが発生しました"}));
            }else{
            // バリデーションでない場合のエラー処理。jsonとは限らない
                throw new Error(JSON.stringify({"unCategorizedError":"不明な処理です"}));
            }
        }
        const returnJson=await response.json();

        // jsonの値でエラーが含まれるとき
        if(returnJson.resultInsertError ||
           returnJson.namePatternError ||
           returnJson.sessionSettingError
        ){
            throw new Error(JSON.stringify({"unCategorizedError":"予期せぬエラーです"}));
        }

        //二重投稿の時
        if(returnJson.duplicatedError){
            throw new Error(JSON.stringify({"unCategorizedError":"duplicated"}));
        }

        return {
            "success":true,
            "returnSets":returnJson
        }
    }catch(e){
        const messageObject=JSON.parse(e.message)
        return {
            "success":false,
            "errorMessage":messageObject
        };
    }
}


