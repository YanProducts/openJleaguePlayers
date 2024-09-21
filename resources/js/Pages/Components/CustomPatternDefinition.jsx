import React, {useState} from "react";

// パターン変化のフックまとめ
export default function CustomPatternDefinition(userName){
        // クイズのパターン一覧
        const [pattern,setPattern]=useState({
            cate:"no_choice",
            quizType:"no_choice",
            nameType:"no_choice",
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

        // キーと名前が同じ場合は省略できる
        return({pattern,setPattern,error,setError,onCateChange,onQuizTypeChange,onNameTypeChange});
}
