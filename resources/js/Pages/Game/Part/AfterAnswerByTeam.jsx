    // 回答後のUI
    import React from "react";
    import { Inertia } from "@inertiajs/inertia";

    // それぞれの回答済選手の要素
    const EachNowAlreadyComponents=({nowAlreadyPlayers})=>{
        return(
            nowAlreadyPlayers.map((n,index)=>{
                return(<li key={index} className="text-center font-bold">{`(${n.team}...${n.nowAlreadyPlayers.join("、")})`}</li>)
            })
        )
    }


    // 回答した選手が回答済だった場合
    const NowAlreadyComponents=(nowAlreadyPlayers)=>{
        // 回答済なしの場合は何も返さない
        if(nowAlreadyPlayers.length==0){
            return null;
        }
        return(
            <div className="bg-gray-200 border-black border-4 base_frame w-2/5 min-w-[300px]">
                <p className="my-1 text-center font-bold">以下の選手たちは既に回答済みです</p>
                <ul>
                    <EachNowAlreadyComponents nowAlreadyPlayers={nowAlreadyPlayers}/>
                </ul>
            </div>
        )
    }

    // 分割代入
    export const AfterAnswerComponent=({setInputSets,isAfter,setIsAfter,isRightState,setIsRightState,answered,nowAlreadyPlayers})=>{

        // 2重のinertia.visitの防止用
        const [moveResult,setMoveResult]=React.useState(false);

        React.useEffect(function(){
            // クイズ回答後の場合は3秒後にクイズ回答前の状態にする
            if(isAfter){
                // input要素はこの段階で空にして、3秒間の間に入力もできるようにする
                setInputSets({});

                // 回答前のUIへ戻す
                const timer=setTimeout(()=>{
                    // クリアしたかどうか
                    // if(Number(props.quiz_type.substring(4))>=answered.length){
                        // 実験
                    if(10<=answered.length){
                        // SQL登録のlaravel。その後に遷移。2回以上登録される。
                        setIsAfter(false);
                        setIsRightState("yet");
                        if(!moveResult){
                            setMoveResult(true);
                            Inertia.visit("/game.clear", {
                                //sessionがあるのでいらない "game_token":game_token
                            });
                        }
                        return;
                    } else {
                        setIsAfter(false);
                        setIsRightState("yet");
                    }
                },3000)
            // useEffect内部での処理を終了後に、useEffectが発生する前の状態に戻す(次回のuseEffect実行時に備える)
                return()=>{
                    clearTimeout(timer);
                    setMoveResult(false);
                }
            }
        },[isAfter])

        // 回答前なら何もしない
        if(!isAfter){
            return null;
        }
        // 回答後(buttonのpointerEventはInput側で操作)
        if(isNaN(Number(isRightState)) && isRightState!=="already" ){
                return  <div className='already_div'>エラー</div>
        }else{
            if(isRightState==0){
             return(
                <>
                 <div className='wrong_div'>X</div>
                    {NowAlreadyComponents(nowAlreadyPlayers)}
                </>
             )
            }else{
            return(
                <>
                    <div className='w-36 right_div '>{isRightState}人正解！</div>
                    {NowAlreadyComponents(nowAlreadyPlayers)}
                </>
            )
        }
        }

    }
