import React from "react";
import MyPageFetch from "../fetchAPI/MyPage_Fetch";
// マイページのみで使用するフック
export default function MyPageCustomDefinition(pattern,setError){
    const [eachAnswerTotalCounts,setEachAnswerTotalCounts]=React.useState("");
    const [eachAnswerDataByTeam,setEachAnswerDataByTeam]=React.useState({});
    const [eachAnswerDataByPlayer,setEachAnswerDataByPlayer]=React.useState({});
    const [clearCountData,setClearCountData]=React.useState("");

    // 選手のテーブル
    const [playerTrComponents,setPlayerTrComponents]=React.useState(null);
    // チームのテーブル
    const [teamTrComponents,setTeamTrComponents]=React.useState(null);


    // optionが操作されたら、それに合う結果を取得
    React.useEffect(()=>{
        MyPageFetch(pattern,setError,setEachAnswerTotalCounts,setEachAnswerDataByTeam,setEachAnswerDataByPlayer,setClearCountData);
    },[pattern])


    return({eachAnswerTotalCounts,setEachAnswerTotalCounts,eachAnswerDataByTeam,setEachAnswerDataByTeam,eachAnswerDataByPlayer,setEachAnswerDataByPlayer,clearCountData,setClearCountData,playerTrComponents,setPlayerTrComponents,teamTrComponents,setTeamTrComponents});
}
