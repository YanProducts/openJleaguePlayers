// 回答ボタンを押した後に回答チェック
export default async function gameplay_fetch(props){
    //fetchのヘッダー
    const headers=new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRF-TOKEN':props.csrf_token,
    });

    // 投稿
    try{
       const response=await fetch(
            props.answer_check_route,
            {
                method:"post",
                headers:headers,
                body:new URLSearchParams({
                    answer:props.inputVal,
                    quizType:props.quiz_type,
                    nameType:props.name_type==="名前の一部" ? "part" : (name_type==="登録名" ? "full":""),
                    team:props.answerTeam,
                    cate:props.cate,
                    answered:JSON.stringify(props.answered)
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


