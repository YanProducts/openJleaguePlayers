import React from "react"

export function InputStyleByInnerWidth(){
return(
    <style>
    {`
        @media(max-width:600px){
            .form_font_change,.form_font_change>select{
                font-size:0.95em
            }
        }
        @media(max-width:400px){
            .form_font_change>input{
                margin-left:2px;
                margin-right:0.5px;
                width:42%;
            }
            .form_font_change>select{
                margin-left:0.5px;
                margin-right:0.5px;
                width:38%;
            }
            .form_font_change>button{
                width:18%;
            }
        }

    `}
</style>
)

}


// 初回とリサイズするごとにoptionの初期値変更
export function OptionDefaultViewChange({setOptionDefaultView}){
    const optionChangeByInnerWidth=()=>{
        if(window.innerWidth<600){
            setOptionDefaultView("チーム")
        }else{
            setOptionDefaultView("チームの選択")
        }
    }
// マウント時とリサイズ時に発火。アンマウント時にクリーンアップ
    React.useEffect(()=>{
        window.addEventListener("resize",optionChangeByInnerWidth);
        optionChangeByInnerWidth();

        return(()=>{
            window.removeEventListener("resize",optionChangeByInnerWidth)
         }
        )
    },[])
    return null;
}
