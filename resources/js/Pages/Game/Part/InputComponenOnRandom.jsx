    // inputのcomponents(quiz_typeの値で変化)

    import React from "react";
    import { Inertia } from "@inertiajs/inertia";
    import { InputStyleByInnerWidth,OptionDefaultViewChange } from "./CustomStyle/InputStyle";

    //   分割代入
   export const InputComponentOnRandom=({props,onAnswerBtnClick,inputRef,answerTeamRef,isAfter})=>{

    // 要素を返す
        const [optionDefaultView,setOptionDefaultView]=React.useState("チームの選択");

        return(
            <>
            <OptionDefaultViewChange setOptionDefaultView={setOptionDefaultView}/>
            <form className="base_input_div flex justify-center form_font_change" onSubmit={onAnswerBtnClick} >
            <input id="inputFiled" className='h-10 ml-auto mr-2 w-1/3' ref={inputRef}/>
            <select id="selectfield" ref={answerTeamRef} className='mr-2 w-1/3 h-10'>
                <option hidden value="no_choice">{optionDefaultView}</option>
                {props.teams.map(m=>(<option key={m.id} value={m.eng_name}>{m.jpn_name}</option>))}
            </select>
            <button className={`base_btn inline-block ml-1 text-left font-bold ${isAfter ? 'opacity-70 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>回答！</button>
            <InputStyleByInnerWidth />
            </form>
            </>
        )
        // エラーページへ遷移
        Inertia.visit("/error_view");
        return;
};
