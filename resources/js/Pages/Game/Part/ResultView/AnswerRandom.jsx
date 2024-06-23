import React from "react";
import {CustomDomRondom} from "./CutomStyle/Rondom";
import {StyleRondom} from "./CutomStyle/Rondom";

// 回答を全部合わせて答える場合
export default function AnswerRandom(props){
    // 画面サイズによって表示変更
    const [thContents,setThContents]=React.useState({
        num:"回答数",
        player:"選手名",
        team:"チーム名"
    });


    const answeredLists=()=>{
        if(props.answered.length===0){
            return(
                <tr>
                    <td colSpan="3" className="w-1/1 text-center bg-white">まだ回答はありません</td>
                </tr>
            )

        }else{
            return(
                props.answered.map((m)=>{
                    const fontColor=0.299*m.red + 0.587 *m.green + 0.114*m.blue > 128 ? "black" : "white";
                    return(
                        <tr key={m.number} className="border-black font-bold"
                        style={{ backgroundColor:`rgb(${m.red},${m.green},${m.blue})`,
                        color:fontColor
                        }}
                        >
                            <td className="w-1/6 text-center border-2 border-black custom_td_1">{m.number}</td>
                            <td className="w-2/3 text-center border-2 border-black custom_td_2">{m.player}</td>
                            <td className="w-1/6 text-center border-2 border-black custom_td_3">{m.team}</td>
                        </tr>
                    )
                })
            )
        }
    }

    return(
        <div>
            <CustomDomRondom setThContents={setThContents} />
            <table className="base_table">
                <thead>
                <tr>
                    <th className="w-1/6 text-center border-2 border-black custom_th_1">{thContents.num}</th>
                    <th className="w-2/3 text-center border-2 border-black custom_th_2">{thContents.player}</th>
                    <th className="w-1/6 text-center border-2 border-black custom_th_3">{thContents.team}</th>
                </tr>
            </thead>
            <tbody>
                {answeredLists()}
            </tbody>
        {/* 「要素が規定より小さい場合」なので例外的にstyle属性 */}
        <StyleRondom/>
     </table>
    </div>
    )
}
