// 回答を全部合わせて答える場合
export default function AnswerRandom(props){

    const answeredLists=()=>{
        if(props.answered.length===0){
            return(
                <tr>
                    <td colSpan="3" className="w-1/1 text-center bg-white">まだ回答はありません</td>
                </tr>
            )

        }else{
            props.answered.map((m)=>{
                return(
                <tr className="border-black">
                    <td className="w-1/6 text-center border-black">{m.number}</td>
                    <td className="w-2/3 text-center border-black">{m.player}</td>
                    <td className="w-1/6 text-center border-black">{m.team}</td>
                </tr>
                )
            });
        }
    }

    return(
        <table className="base_table">
            <thead>
                <tr>
                    <th className="w-1/5 text-center border-2 border-black">回答数</th>
                    <th className="w-3/5 text-center border-2 border-black">選手名</th>
                    <th className="w-1/5 text-center border-2 border-black">チーム名</th>
                </tr>
            </thead>
            <tbody>
                {answeredLists()}
            </tbody>
        </table>
    )
}
