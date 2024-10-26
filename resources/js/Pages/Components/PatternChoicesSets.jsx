// カテ、クイズ、形式のselect
const BaseSelectSets=({jpn_name,engShortName,changeFunction,sets,error,pageName})=>{

    const divClassByEachPageName= pageName==="myPage" ? "my-0 text-center w-full md:w-1/3 border-b-2 border-black md:border-none py-2 base_backColor" : "base-frame base_backColor text-center mb-10";

    const selectClassNameByEachComponents=pageName==="myPage" ?  "mx-auto p-2 min-w-[160px] md:w-4/5" : (engShortName==="nameType" ? "ml-6 w-[170px]" :"ml-3 w-[170px]")

    return(
        <div className={divClassByEachPageName}>
        <label htmlFor={`${engShortName}_select`}>{jpn_name}</label>
        <br className={pageName==="myPage" ? "inline" : "hidden" }/>
        <select className={selectClassNameByEachComponents} id={`${engShortName}_select`} name={engShortName} defaultValue={pageName==="myPage" ? "all" :""} onChange={changeFunction}>

            {pageName==="topPage" ? <option hidden value="no_choice">選んでください</option> : null }
            {
                Object.entries(sets).map(([the_key,value])=>{
                    return(<option value={the_key}
                    key={the_key} className={pageName==="myPage" ? "text-center" : ""} >{value}</option>)
                })
        }
        </select>
        {/* バリデーションエラー時 */}
        {error[engShortName] &&
        (
            <p className='base_error animate-whenerror'>{error[engShortName].join("\n")}</p>
        )
        }
    </div>
    )
}

export default function PatternChoicesSets({onCateChange,jsonCateSets,onQuizTypeChange,jsonQuizSets,onNameTypeChange,jsonNameSets,error,pageName}){

    // jsonをオブジェクト形式に直す
    const cateSets=JSON.parse(jsonCateSets);
    const quizSets=JSON.parse(jsonQuizSets);
    const nameSets=JSON.parse(jsonNameSets);

    // データを見る場合、quizSetsとnameSetsに「全て」をたす
    if(pageName==="myPage"){
        quizSets["all"]="全て";
        nameSets["all"]="全て";
    }

    return(
            <div className={`${pageName==="myPage"? "block mx-auto  md:flex md:items-center font-bold md:my-2 base_frame":""}`}>
                <BaseSelectSets
                    jpn_name="カテゴリー"
                    engShortName="cate"
                    changeFunction={onCateChange}
                    sets={cateSets}
                    error={error}
                    pageName={pageName}
                />
                <BaseSelectSets
                    jpn_name="クイズ形式"
                    engShortName="quizType"
                    changeFunction={onQuizTypeChange}
                    sets={quizSets}
                    error={error}
                    pageName={pageName}
                />
                <BaseSelectSets
                    jpn_name="回答形式"
                    engShortName="nameType"
                    changeFunction={onNameTypeChange}
                    sets={nameSets}
                    error={error}
                    pageName={pageName}
              />
            </div>
    )

}
