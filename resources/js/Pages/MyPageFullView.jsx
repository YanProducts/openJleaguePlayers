import React from "react";
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import PatternChoicesSets from "./Components/PatternChoicesSets";
import CustomPatternDefinition from "./Definitions/CustomPatternDefinition";
import MyPageCustomDefinition from "./Definitions/MyPageCustomDefinition";
import {MyPagePlayerComponents} from "./Components/MyPagePlayerComponents";
import {MyPageTeamComponents} from "./Components/MyPageTeamComponents";
import MyPageTrComponents from "./Components/MyPageTrComponents";


// マイページの表示
export default function MyPageFullView({cateSets,quizSets,nameSets,user,which="player"}){

    // topPageとmyPageで共通のフック
    const { pattern,setPattern,error,setError,onCateChange,onQuizTypeChange,onNameTypeChange } = CustomPatternDefinition(user.name,"myPage");

    // myPageのみで使用するフック
    const{eachAnswerTotalCounts,setEachAnswerTotalCounts,eachAnswerDataByTeam,setEachAnswerDataByTeam,eachAnswerDataByPlayer,setEachAnswerDataByPlayer,clearCountData,setClearCountData,playerTrComponents,setPlayerTrComponents,teamTrComponents,setTeamTrComponents,viewAllAnsweredPlayers,viewAllAnsweredTeams,hiddenPlayersCounts,setHiddenPlayerCounts,hiddenTeamsCounts,setHiddenTeamsCounts,lastPlayerVisbleRank,setLastPlayerVisibleRank,lastTeamVisbleRank,setLastTeamVisibleRank,
    playerTbodyRef,
    teamTbodyRef,
    myPageFetchDone}=MyPageCustomDefinition(pattern,setError);

    // trの内部に要素を追加して定義(それぞれのtrComponentsで呼び出し)
    MyPageTrComponents(eachAnswerDataByPlayer,playerTrComponents,setPlayerTrComponents,eachAnswerDataByTeam,teamTrComponents,setTeamTrComponents,setHiddenPlayerCounts,setHiddenTeamsCounts,setLastPlayerVisibleRank,setLastTeamVisibleRank,"full"
    )


    return(
        <AuthenticatedLayout
        user={user.name}
        pageName="MyPageFullView"
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
                    pageName="myPageFullView"
            />
        </div>

        {which==="player" ?
        <MyPagePlayerComponents
            fullOrNormal="full"
            playerTbodyRef={playerTbodyRef}
            playerTrComponents={playerTrComponents}
            hiddenPlayersCounts={hiddenPlayersCounts}
            lastPlayerVisbleRank={lastPlayerVisbleRank}
            viewAllAnsweredPlayers={viewAllAnsweredPlayers}
        />
        :
        <MyPageTeamComponents
                fullOrNormal="full"
                teamTbodyRef={teamTbodyRef}
                teamTrComponents={teamTrComponents}
                hiddenTeamsCounts={hiddenTeamsCounts}
                lastTeamVisbleRank={lastTeamVisbleRank}
                viewAllAnsweredTeams={viewAllAnsweredTeams}
        />
        }

         </div>
        </AuthenticatedLayout>
    )
}
