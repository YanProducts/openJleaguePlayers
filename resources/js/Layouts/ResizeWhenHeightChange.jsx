import React from "react";
// 高さが変わった時の変更
export default function heightCheck(fixedBottom,pageName){
    if(pageName==="MyPage"){
        if(document.documentElement.scrollHeight>window.innerHeight){
            fixedBottom.current.classList.add("fixed");
            fixedBottom.current.classList.remove("relative");
        }else{
            fixedBottom.current.classList.add("relative");
            fixedBottom.current.classList.remove("fixed");
        }
    }
}
