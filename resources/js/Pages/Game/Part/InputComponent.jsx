    // inputのcomponents(quiz_typeの値で変化)

    import React from "react";
    import { Inertia } from "@inertiajs/inertia";
    import { InputStyleByInnerWidth,OptionDefaultViewChange } from "./CustomStyle/InputStyle";

    //   分割代入
   export const InputComponent=({props,onAnswerBtnClick,inputRef,inputVal,onInputChange,answerTeam,setAnswerTeam,isAfter})=>{

    // 要素を返す
    if(props.quiz_type.indexOf("team")!==-1){
        return(
            <form className="base_input_div flex justify-center" onSubmit={onAnswerBtnClick} >
            <input className='h-8 ml-auto' ref={inputRef} value={inputVal} onChange={onInputChange} />
            <button
            className={`base_btn inline-block ml-1 text-left ${isAfter ? 'pointer-events-auto' : 'pointer-events-none'}`}>回答！</button>
            </form>
        )
    }else if(props.quiz_type.indexOf("rand")!==-1){

        const onTeamSelectChange=(e)=>{
            setAnswerTeam(e.target.value);
        }

        const [optionDefaultView,setOptionDefaultView]=React.useState("チームの選択");

        return(
            <>
            <OptionDefaultViewChange setOptionDefaultView={setOptionDefaultView}/>
            <form className="base_input_div flex justify-center form_font_change" onSubmit={onAnswerBtnClick} >
            <input className='h-10 ml-auto mr-2 w-1/3' ref={inputRef} value={inputVal} onChange={onInputChange}/>
            <select value={answerTeam} className='mr-2 w-1/3 h-10' onChange={onTeamSelectChange}>
                <option hidden value="no_choice">{optionDefaultView}</option>
                {props.teams.map(m=>(<option key={m.id} value={m.eng_name}>{m.jpn_name}</option>))}
            </select>
            <button className={`base_btn inline-block ml-1 text-left ${isAfter ? 'opacity-70 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>回答！</button>
            <InputStyleByInnerWidth />
            </form>
            </>
        )
    }else{
        // エラーページへ遷移
        Inertia.visit("/error_view");
        return;
    }
};
