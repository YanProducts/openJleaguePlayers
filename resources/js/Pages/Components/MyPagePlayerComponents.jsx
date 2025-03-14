export const MyPagePlayerComponents=({fullOrNormal="normal",playerTbodyRef,playerTrComponents,hiddenPlayersCounts,lastPlayerVisbleRank,viewAllAnsweredPlayers,handleViewAllPlayers})=>

<div className="base_frame">
<h2 className="base_h base_h border-2 text-lg border-black">回答された選手</h2>
<table className={`base_table mt-2 ${fullOrNormal==="normal" ? "mb-1" :"mb-4"}`}>
  <thead>
      <tr className="base_tableInner">
      <th className="base_tableInner">順位</th>
      <th className="base_tableInner">選手名</th>
      <th className="base_tableInner">チーム名</th>
      <th className="base_tableInner">回答回数</th>
      </tr>
  </thead>
  <tbody id="resultPlayerTbody" ref={playerTbodyRef}>
      {playerTrComponents}
  </tbody>
</table>
{hiddenPlayersCounts !==0 && fullOrNormal==="normal" ? <div className="base_frame  base_backColor text-center mt-1 mb-1 border-2 border-black"><p className="font-bold"> {lastPlayerVisbleRank}位あと{hiddenPlayersCounts}人</p></div> : null}

{viewAllAnsweredPlayers && fullOrNormal==="normal"  ? <div className="base_frame  base_backColor text-center mt-0 mb-5 border-2 border-black"><p className="font-bold" onClick={handleViewAllPlayers}>30位以下は<span className="text-blue-600 cursor-pointer">こちら</span></p></div> :null}

</div>
