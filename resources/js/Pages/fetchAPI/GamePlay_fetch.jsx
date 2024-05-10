// 回答ボタンを押した後に回答チェック
export default async function gameplay_fetch(props){

    //fetchのヘッダー
    const headers={
        "Content-Type":"application:x-www-form-urlencoded",
        "X-CSRF-TOKEN":props.csrf_token,
    }

    // 投稿
    try{
       const response=await fetch(
            props.answer_check_route,{
                method:"post",
                header:headers,
                body:new URLSearchParams({
                    answer:props.inputValue,
                    quiz_type:props.quiz_type,
                    name_type:props.name_type,
                    team:props.answerTeam,
                    cate:props.cate
                })
            });

        // input要素を空にしてfocus(成功でもエラーでも同じ処理)
        props.setInputVal("")
        props.inputRef.current.focus();

        if(!response.ok){
            if(response.status===422){
                // バリデーションエラー
                const returnedError=await response.json();
                throw new Error(JSON.stringify(returnedError.errors));
            }else{
            // バリデーションでない場合のエラー処理。jsonとは限らない
                throw new Error(JSON.stringify({"unCategorizedError":"不明な処理です"}));
            }
        }
        return {
            "success":true
        }
    }catch{
        const messageObject=JSON.parse(e.message)
        return {
            "success":false,
            "errorMessage":messageObject
        };

    }

}
