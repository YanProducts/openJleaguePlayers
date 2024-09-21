import React from "react";
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import PatternChoicesSets from "./Components/PatternChoicesSets";
import CustomPatternDefinition from "./Components/CustomPatternDefinition";

// マイページの表示
export default function MyPage({csrf_token,cateSets,quizSets,nameSets,user}){



    const { pattern,setPattern,error,setError,onCateChange,onQuizTypeChange,onNameTypeChange } = CustomPatternDefinition(user.name);


    return(
        <AuthenticatedLayout
        user={user.name}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">トップページ</h2>}
        pageName="MyPage"
        >
         <div>
          <h1 className="base_h">{user.nmae}さんの回答数</h1>

        <div class="base_frame flex">
            <PatternChoicesSets
                    onCateChange={onCateChange}
                    cateSets={cateSets}
                    onQuizTypeChange={onQuizTypeChange}
                    quizSets={quizSets}
                    onNameTypeChange={onNameTypeChange}
                    nameSets={nameSets}
                    error={error}
                    pageName="myPage"
            />
        </div>

        <div className="">
          <h2>合計回数</h2>
          <table className="">
            <tr className="">
             <th className="">クリア回数</th>
             <th className="">合計正解回答数</th>
            </tr>
            <tr className="">
             <td className=""></td>
             <td className=""></td>
            </tr>
          </table>
        </div>

        <div className="">
          <h2>回答された選手</h2>
          <table className="">
            <tr className="">
             <th className="">選手名</th>
             <th className="">回答回数</th>
            </tr>
            <tr className="">
             <td className=""></td>
             <td className=""></td>
            </tr>
          </table>
        </div>

        <div className="">
          <h2>回答の多いチーム</h2>
          <table className="">
            <tr className="">
             <th className="">チーム名</th>
             <th className="">回答回数</th>
            </tr>
            <tr className="">
             <td className=""></td>
             <td className=""></td>
            </tr>
          </table>
        </div>


         </div>
        </AuthenticatedLayout>
    )
}
