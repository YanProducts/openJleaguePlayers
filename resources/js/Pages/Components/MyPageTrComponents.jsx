import React from "react";
// myPageにおけるテーブル変更のコンポーネント
export default function MyPageTrComponents(eachAnswerDataByPlayer,setPlayerTrComponents,eachAnswerDataByTeam,setTeamTrComponents){

    const updateTrComponents=(which,colspan,eachData,setEachData)=>{
        if(Object.keys(eachData).length==0){
            setEachData(
                    <tr className="base_tableInner">
                        <td colSpan={colspan} className="base_tableInner">該当なし</td>
                    </tr>
            );
            return;
        }
        setEachData(
            eachData.map((data,index)=>{
                // 背景に合わせて黒文字か白文字かの選択
                const blackOrWhite=0.299*data.red + 0.587 *data.green + 0.114*data.blue > 128 ? "black" : "white";
                return(
                <tr key={index} className="base_tableInner"
                style={{ backgroundColor:`rgb(${data.red},${data.green},${data.blue})`,color:`${blackOrWhite}`}}
                >
                    {which==="player" ? (<td className="base_tableInner">{data.full}</td>):(null)}
                    <td className="base_tableInner">{data.team}</td>
                    <td className="base_tableInner">{data.count}</td>

                </tr>
                )}
            ))
        }

        // playersDataが更新されたらテーブルの内容変更
        React.useEffect(()=>{
            updateTrComponents("player","3",eachAnswerDataByPlayer,setPlayerTrComponents);
        },[eachAnswerDataByPlayer])

        // teamDataが更新されたらテーブルの内容変更
        React.useEffect(()=>{
            updateTrComponents("team","2",eachAnswerDataByTeam,setTeamTrComponents);
        },[eachAnswerDataByTeam])
}
