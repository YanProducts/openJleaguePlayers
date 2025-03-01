
export const MyPageTeamComponents=({fullOrNormal="normal",teamTbodyRef,teamTrComponents,hiddenTeamsCounts,lastTeamVisbleRank,viewAllAnsweredTeams,handleViewAllTeams})=>

        <div className={`base_frame ${fullOrNormal==="normal" ? "mb-20" : ""}`}>
          <h2 className="base_h border-2 text-lg border-black">回答されたチーム</h2>
          <table className={`base_table mt-2 ${fullOrNormal==="normal" ? "mb-1" :"mb-4"}`}>
            <thead>
                <tr className="base_tableInner">
                <th className="base_tableInner">順位</th>
                <th className="base_tableInner">チーム名</th>
                <th className="base_tableInner">回答回数</th>
                </tr>
            </thead>
            <tbody id="resultTeamTbody" ref={teamTbodyRef}>
                {teamTrComponents}
            </tbody>
          </table>
          {hiddenTeamsCounts !==0 && fullOrNormal==="normal" ? <div className="base_frame  base_backColor text-center mt-1 mb-1 border-2 border-black"><p className="font-bold"> {lastTeamVisbleRank}位あと{hiddenTeamsCounts}チーム</p></div> : null}

          {viewAllAnsweredTeams && fullOrNormal==="normal" ? <div className="base_frame  base_backColor text-center mt-1  border-2 border-black"><p className="text-blue-600 cursor-pointer font-bold" onClick={handleViewAllTeams}>10位以下はこちら</p></div> : null}
        </div>
