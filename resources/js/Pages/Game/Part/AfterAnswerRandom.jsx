    // 回答後のUI
    import React from "react";
    import { Inertia } from "@inertiajs/inertia";

    // 分割代入
    export const AfterAnswerComponent=({isAfter,setIsAfter,isRightState,setIsRightState,answered,quiz_type})=>{

        // 2重のinertia.visitの防止用
        const [moveResult,setMoveResult]=React.useState(false);

        React.useEffect(function(){
            // クイズ回答後の場合は3秒後にクイズ回答前の状態にする
            if(isAfter){
                // 回答前のUIへ戻す
                const timer=setTimeout(()=>{
                    // クリアしたかどうか
                    // if(Number(quiz_type.substring(4))>=answered.length){
                        // 実験
                    if(10<=answered.length){
                        // SQL登録のlaravel。その後に遷移。2回以上登録される。
                        setIsAfter(false);
                        if(!moveResult){
                            setMoveResult(true);
                            Inertia.visit("/game.clear", {
                                //sessionがあるのでいらない "game_token":game_token
                            });
                        }
                        return;
                    } else {
                        setIsAfter(false);
                    }
                },2000)
            // useEffect内部での処理を終了後に、useEffectが発生する前の状態に戻す
                return()=>{
                    setIsAfter(false);
                    clearTimeout(timer);
                    setIsRightState("yet");
                    setMoveResult(false);
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
            return  <div className='already_div'>エラー</div>
        }
    }
