import React from "react";
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import PatternChoicesSets from "./Components/PatternChoicesSets";
import CustomPatternDefinition from "./Definitions/CustomPatternDefinition";
import MyPageCustomDefinition from "./Definitions/MyPageCustomDefinition";
import {MyPagePlayerComponents} from "./Components/MyPagePlayerComponents";
import {MyPageTeamComponents} from "./Components/MyPageTeamComponents";
import MyPageTrComponents from "./Components/MyPageTrComponents";


// マイページの表示
export default function MyPage({cateSets,quizSets,nameSets,user}){


    // topPageとmyPageで共通のフック
    const { pattern,setPattern,error,setError,onCateChange,onQuizTypeChange,onNameTypeChange } = CustomPatternDefinition(user.name,"myPage");

    // myPageのみで使用するフック
    const{eachAnswerTotalCounts,setEachAnswerTotalCounts,eachAnswerDataByTeam,setEachAnswerDataByTeam,eachAnswerDataByPlayer,setEachAnswerDataByPlayer,clearCountData,setClearCountData,playerTrComponents,setPlayerTrComponents,teamTrComponents,setTeamTrComponents,viewAllAnsweredPlayers,viewAllAnsweredTeams,hiddenPlayersCounts,setHiddenPlayerCounts,hiddenTeamsCounts,setHiddenTeamsCounts,lastPlayerVisbleRank,setLastPlayerVisibleRank,lastTeamVisbleRank,setLastTeamVisibleRank,
    playerTbodyRef,
    teamTbodyRef,
    myPageFetchDone}=MyPageCustomDefinition(pattern,setError);

    // trの内部に要素を追加して定義(それぞれのtrComponentsで呼び出し)
    MyPageTrComponents(eachAnswerDataByPlayer,playerTrComponents,setPlayerTrComponents,eachAnswerDataByTeam,teamTrComponents,setTeamTrComponents,setHiddenPlayerCounts,setHiddenTeamsCounts,setLastPlayerVisibleRank,setLastTeamVisibleRank
    )

    // 全プレーヤー表示
    const handleViewAllPlayers=()=>{
        window.open("/myFullResult/player", '_blank',)
    }
    // 全チーム表示
    const handleViewAllTeams=()=>{
        window.open("/myFullResult/team",'_blank',)
    }


    return(
        <AuthenticatedLayout
        user={user.name}
        pageName="MyPage"
        myPageFetchDone={myPageFetchDone}
        >
         <div>

         <div>　</div>

          <h1 className="base_h flex items-center justify-center h-12 text-xl my-5 text-center">{user.name}さんのデータ</h1>


        <div className="base_frame flex">
            <PatternChoicesSets
                    onCateChange={onCateChange}
                    jsonCateSets={cateSets}
                    onQuizTypeChange={onQuizTypeChange}
                    jsonQuizSets={quizSets}
                    onNameTypeChange={onNameTypeChange}
                    jsonNameSets={nameSets}
                    error={error}
                    pageName="myPage"
            />
        </div>

        <div className="base_frame mt-5">
          <h2 className="base_h">合計回数</h2>
          <table className="base_table mt-2">
            <thead>
                <tr className="base_tableInner">
                <th className="base_tableInner">クリア回数</th>
                <th className="base_tableInner">合計正解回答数</th>
                </tr>
            </thead>
            <tbody>
                <tr className="base_tableInner">
                <td className="base_tableInner">{clearCountData}</td>
                <td className="base_tableInner">{eachAnswerTotalCounts}</td>
                </tr>
            </tbody>
          </table>
        </div>

        <MyPagePlayerComponents
            fullOrNormal="normal"
            playerTbodyRef={playerTbodyRef}
            playerTrComponents={playerTrComponents}
            hiddenPlayersCounts={hiddenPlayersCounts}
            lastPlayerVisbleRank={lastPlayerVisbleRank}
            viewAllAnsweredPlayers={viewAllAnsweredPlayers}
            handleViewAllPlayers={handleViewAllPlayers}
        />

        <MyPageTeamComponents
                fullOrNormal="normal"
                teamTbodyRef={teamTbodyRef}
                teamTrComponents={teamTrComponents}
                hiddenTeamsCounts={hiddenTeamsCounts}
                lastTeamVisbleRank={lastTeamVisbleRank}
                viewAllAnsweredTeams={viewAllAnsweredTeams}
                handleViewAllTeams={handleViewAllTeams}
        />

         </div>
        </AuthenticatedLayout>
    )
}
