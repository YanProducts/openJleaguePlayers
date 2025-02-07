import React from "react";
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import PatternChoicesSets from "./Components/PatternChoicesSets";
import CustomPatternDefinition from "./Components/CustomPatternDefinition";
import MyPageCustomDefinition from "./Components/MyPageCustomDefinition";
import MyPageTrComponents from "./Components/MyPageTrComponents";


// マイページの表示
export default function MyPage({cateSets,quizSets,nameSets,user}){

    // topPageとmyPageで共通のフック
    const { pattern,setPattern,error,setError,onCateChange,onQuizTypeChange,onNameTypeChange } = CustomPatternDefinition(user.name,"myPage");

    // myPageのみで使用するフック
    const{eachAnswerTotalCounts,setEachAnswerTotalCounts,eachAnswerDataByTeam,setEachAnswerDataByTeam,eachAnswerDataByPlayer,setEachAnswerDataByPlayer,clearCountData,setClearCountData,playerTrComponents,setPlayerTrComponents,teamTrComponents,setTeamTrComponents}=MyPageCustomDefinition(pattern,setError);

    // trの内部
    MyPageTrComponents(eachAnswerDataByPlayer,setPlayerTrComponents,eachAnswerDataByTeam,setTeamTrComponents)


    return(
        <AuthenticatedLayout
        user={user.name}
        pageName="MyPage"
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
                <td className="base_tableInner">{eachAnswerTotalCounts}</td>
                <td className="base_tableInner">{clearCountData}</td>
                </tr>
            </tbody>
          </table>
        </div>

        <div className="base_frame">
          <h2 className="base_h">回答された選手</h2>
          <table className="base_table mt-2">
            <thead>
                <tr className="base_tableInner">
                <th className="base_tableInner">選手名</th>
                <th className="base_tableInner">チーム名</th>
                <th className="base_tableInner">回答回数</th>
                </tr>
            </thead>
            <tbody>
                {playerTrComponents}
            </tbody>
          </table>
        </div>

        <div className="base_frame">
          <h2 className="base_h">回答の多いチーム</h2>
          <table className="base_table mt-2">
            <thead>
                <tr className="base_tableInner">
                <th className="base_tableInner">チーム名</th>
                <th className="base_tableInner">回答回数</th>
                </tr>
            </thead>
            <tbody>
                {teamTrComponents}
            </tbody>
          </table>
        </div>
         </div>
        </AuthenticatedLayout>
    )
}
