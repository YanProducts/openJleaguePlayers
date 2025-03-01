import React, {useState} from "react";

// パターン変化のフックまとめ
export default function CustomPatternDefinition(userName,pageName){
        const isMyPage=pageName==="myPage";

        // クイズのパターン一覧
        const [pattern,setPattern]=useState({
            cate:isMyPage ? "all" :"no_choice",
            quizType:isMyPage ? "all" :"no_choice",
            nameType:isMyPage ? "all" :"no_choice",
            user:userName
         })

        // エラーかどうか
        const [error,setError]=useState({});

        // カテゴリー変更
        const onCateChange=(e)=>{
            setPattern({...pattern,cate:e.target.value});
        }

        // クイズタイプ変更
        const onQuizTypeChange=(e)=>{
            setPattern({...pattern,quizType:e.target.value});
        }

        // 名前タイプ変更
        const onNameTypeChange=(e)=>{
            setPattern({...pattern,nameType:e.target.value});
        }


        // エラーが設定＝表示された３秒後に消える
        React.useEffect(()=>{
            const errorTimeout=setTimeout(()=>{
                if(error){
                    setError("");
                    return;
                }
            },3000);
            return(()=>{
                clearTimeout(errorTimeout)

            })
        },[error])

        // キーと名前が同じ場合は省略できる
        return({pattern,setPattern,error,setError,onCateChange,onQuizTypeChange,onNameTypeChange});
}
