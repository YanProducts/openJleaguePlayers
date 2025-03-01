import React from "react";
import MyPageFetch from "../../API/FetchAPI/MyPageFetch";


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

    // 省略されているいる部分へのフル表示
    const [viewAllAnsweredPlayers,setViewAllAnsweredPlayers]=React.useState(false);
    const [viewAllAnsweredTeams,setViewAllAnsweredTeams]=React.useState(false);

    // 指定順位と同じ順位があと何人か？
    const [hiddenPlayersCounts,setHiddenPlayerCounts]=React.useState(0);
    // 指定順位と同じ順位があと何チームか？
    const [hiddenTeamsCounts,setHiddenTeamsCounts]=React.useState(0);

    // 表示される最後の順位(選手)
    const [lastPlayerVisbleRank,setLastPlayerVisibleRank]=React.useState(0);

    // 表示される最後の順位(チーム)
    const [lastTeamVisbleRank,setLastTeamVisibleRank]=React.useState(0);

    // fetchが終了したか？
    const [myPageFetchDone,setMyPageFetchDone]=React.useState(false);


    // tbodyのref
    const playerTbodyRef=React.useRef();
    const teamTbodyRef=React.useRef();

    // optionが操作されたら、それに合う結果を取得
    React.useEffect(()=>{
        MyPageFetch(pattern,setError,setEachAnswerTotalCounts,setEachAnswerDataByTeam,setEachAnswerDataByPlayer,setClearCountData,setViewAllAnsweredPlayers,setViewAllAnsweredTeams,
        setMyPageFetchDone);
    },[pattern])


    return({eachAnswerTotalCounts,setEachAnswerTotalCounts,eachAnswerDataByTeam,setEachAnswerDataByTeam,eachAnswerDataByPlayer,setEachAnswerDataByPlayer,clearCountData,setClearCountData,playerTrComponents,setPlayerTrComponents,teamTrComponents,setTeamTrComponents,viewAllAnsweredPlayers,viewAllAnsweredTeams,
    hiddenPlayersCounts,setHiddenPlayerCounts,hiddenTeamsCounts,setHiddenTeamsCounts,lastPlayerVisbleRank,setLastPlayerVisibleRank,lastTeamVisbleRank,setLastTeamVisibleRank,
    playerTbodyRef,
    teamTbodyRef,
    myPageFetchDone});

}
