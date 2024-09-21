// カテ、クイズ、形式のselect
const BaseSelectSets=({jpn_name,engShortName,changeFunction,sets,error})=>{
    return(
        <div className="base-frame base_backColor  text-center mb-10">
        <label htmlFor={`${engShortName}_select`}>{jpn_name}</label>
        <select className="ml-3" id={`${engShortName}_select`} name={engShortName}
        onChange={changeFunction}>
            <option hidden value="no_choice">選択してください</option>
            {
                Object.entries(JSON.parse(sets)).map(([the_key,value])=>{
                    return(<option value={the_key}
                    key={the_key}>{value}</option>)
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

export default function PatternChoicesSets({onCateChange,cateSets,onQuizTypeChange,quizSets,onNameTypeChange,nameSets,error,pageName}){
    return(
            <div className={`${pageName==="myPage"? "flex":""}`}>
                <BaseSelectSets
                    jpn_name="カテゴリー"
                    engShortName="cate"
                    changeFunction={onCateChange}
                    sets={cateSets}
                    error={error}
                />
                <BaseSelectSets
                    jpn_name="クイズ形式"
                    engShortName="quizType"
                    changeFunction={onQuizTypeChange}
                    sets={quizSets}
                    error={error}
                />
                <BaseSelectSets
                    jpn_name="回答形式"
                    engShortName="nameType"
                    changeFunction={onNameTypeChange}
                    sets={nameSets}
                    error={error}
                />
            </div>
    )

}
