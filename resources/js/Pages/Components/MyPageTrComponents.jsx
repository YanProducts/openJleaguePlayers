import React from "react";
// myPageにおけるテーブル変更のコンポーネント
export default function MyPageTrComponents(eachAnswerDataByPlayer,playerTrComponents,setPlayerTrComponents,eachAnswerDataByTeam,teamTrComponents,setTeamTrComponents,setHiddenPlayerCounts,setHiddenTeamsCounts,setLastPlayerVisibleRank,setLastTeamVisibleRank,fullOrNormal="normal"
){


    // オブジェクトはスコープ内で参照渡しになる
    let finalHiddenData=React.useRef({
        playerNumber:0,teamNumber:0,playerDone:false,playerHidden:0,teamHidden:0,teamDone:false
    })

    const updateTrComponents=(which,colspan,eachBaseData,setEachData)=>{
        // 該当がない場合はなしでreturn
        if(Object.keys(eachBaseData).length==0){
            setEachData(
                    <tr className="base_tableInner">
                        <td colSpan={colspan} className="base_tableInner">該当なし</td>
                    </tr>
            );
            return;
        }

        // 該当がある場合
        // 順位&前の数&あと〜人のフラグ
        let number=1;
        let beforeCount=null;
        let sameValueCounts=0;
        let hiddenPlayersCountBase=0;
        let hiddenTeamsCountBase=0;

        setEachData(
            eachBaseData.map((data,index)=>{
                // 選手は30位以下、チームは10以以下は載せない
                // 同順位は「あと〜人」に乗せる(beforeCountは更新しない)
                if(fullOrNormal==="normal"){
                    if(which==="player" && index>=30){
                        if(beforeCount===data.count){
                            hiddenPlayersCountBase+=1
                        }
                        //同じ順位があと〜人の更新
                        // 最後の順位の更新
                        // オブジェクトを更新（参照渡しになる）
                        if(!finalHiddenData.playerDone){
                            finalHiddenData.current.playerNumber=number;
                            finalHiddenData.current.playerHidden=hiddenPlayersCountBase;
                            finalHiddenData.current.playerDone=true;
                        }
                        return null;
                      }else if(which==="team" && index>=10){
                        if(beforeCount===data.count){
                            hiddenTeamsCountBase+=1;
                        }
                        //同じ順位があと〜人の更新
                        // 最後の順位の更新
                        // オブジェクトを更新（参照渡しになる）
                        if(!finalHiddenData.teamDone){
                            finalHiddenData.current.teamNumber=number;
                            finalHiddenData.current.teamHidden=hiddenTeamsCountBase;
                            finalHiddenData.current.teamDone=true;
                        }
                        return null;
                    }
                }

                // 前の順位の選手より回答された数が少ないとき=順位＋同じ順位者
                if(beforeCount>data.count){
                    number+=sameValueCounts
                    sameValueCounts=1;
                }else{
                    sameValueCounts+=1;
                }

                // 背景に合わせて黒文字か白文字かの選択
                const blackOrWhite=0.299*data.red + 0.587 *data.green + 0.114*data.blue > 128 ? "black" : "white";
                beforeCount=data.count;

                return(
                <tr key={index} className="base_tableInner"
                style={{ backgroundColor:`rgb(${data.red},${data.green},${data.blue})`,color:`${blackOrWhite}`}}
                >
                    <td className="base_tableInner">{number}</td>
                    {which==="player" ? (<td className="base_tableInner">{data.full}</td>):(null)}
                    <td className="base_tableInner">{data.team}</td>
                    <td className="base_tableInner">{data.count}</td>
                </tr>
            )})
           )

        }

        // playersDataが更新されたらテーブルの内容変更
        React.useEffect(()=>{
            updateTrComponents("player","4",eachAnswerDataByPlayer,setPlayerTrComponents);
        },[eachAnswerDataByPlayer])

        // teamDataが更新されたらテーブルの内容変更
        React.useEffect(()=>{
            updateTrComponents("team","3",eachAnswerDataByTeam,setTeamTrComponents);
        },[eachAnswerDataByTeam])

        React.useEffect(()=>{
            setHiddenPlayerCounts(finalHiddenData.current.playerHidden)
            setLastPlayerVisibleRank(finalHiddenData.current.playerNumber);
        },[playerTrComponents])
        React.useEffect(()=>{
            setHiddenTeamsCounts(finalHiddenData.current.teamHidden);
            setLastTeamVisibleRank(finalHiddenData.current.teamHidden);
        },[teamTrComponents])


}

