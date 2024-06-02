    // 回答後のUI
    import React from "react";
    import { Inertia } from "@inertiajs/inertia";

    // 分割代入
    export const AfterAnsewrComponent=({isAfter,setIsAfter,isRightState,answered})=>{

        React.useEffect(function(){
            // クイズ回答後の場合は3秒後に疑似ページ遷移してクイズ回答前の状態にする
            if(isAfter){
                // 回答前のUIへ戻す
                const timer=setTimeout(()=>{
                    // クリアしたかどうか
                    // if(Number(props.quiz_type.substring(4))>=answered.length){
                    if(1>=answered.length){
                        Inertia.visit("/game/clear");
                    } else {
                        setIsAfter(false);
                    }
                },3000)
            // useEffect内部での処理を終了後に、useEffectが発生する前の状態に戻す
                return()=>{
                    clearTimeout(timer)
                }
            }
        },[isAfter])
        // 回答前なら何もしない
        if(!isAfter){
            return null;
        }
        // 回答後(buttonのpointerEventはInput側で操作)
        switch(isRightState){
            case "right":
                return <div className='right_div'>正解！</div>
            case "wrong":
                return <div className='wrong_div'>X</div>
            case "already":
            return  <div className='already_div'>回答済</div>
            default:
            // 処理段階のエラー
            return  <div className='already_div'>エラーです</div>
        }
    }
