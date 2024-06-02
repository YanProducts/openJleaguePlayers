import React from "react";

export function
CustomDomRondom({setThContents}){
    const thViewChange=()=>{
        if(window.innerWidth<400){
            setThContents({
                num:"数",
                player:"選手",
                team:"チーム"
            })
        }else if(window.innerWidth<600){
            setThContents({
                num:"回答数",
                player:"選手",
                team:"チーム"
            })
        }else{
            setThContents({
                num:"回答数",
                player:"選手名",
                team:"チーム名"
            })
        }
    }

    // 初期にこの関数を無条件動作、イベントリスナー設定。アンマウント時に消去
    React.useEffect(()=>{
         window.addEventListener("resize",thViewChange)
         thViewChange();
        return(()=>{
         window.removeEventListener("resize",thViewChange)
        });
    },[]);
    return null;
}

export function StyleRondom(){
    return(
        <style>
            {`
                @media (max-width:400px){
                    .custom_th_1,.custom_td_1{
                        width:15%;
                    }
                    .custom_th_2,.custom_td_2{
                        width:65%;
                    }
                    .custom_th_3,.custom_td_3{
                        width:35%;
                    }
                }
            `}
        </style>
    )
}
