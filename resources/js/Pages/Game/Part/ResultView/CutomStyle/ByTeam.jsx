import { Inertia } from "@inertiajs/inertia"
import React from "react";

    // flexの個数と長さの定義用
    export const setInnerWidth=(setFlexCounts,innerWidth,setEachFlexWidth)=>{

            // widthのベース
            let baseWidth=innerWidth*4/5;
            // width最小値
            if(innerWidth<375){
                baseWidth=300;
            }

            let flexWidth="";
            if(innerWidth>1450){
                flexWidth=(baseWidth/7 -32);
                setFlexCounts(7)
            }else if(innerWidth>1250){
                flexWidth=(baseWidth/6 -28);
                setFlexCounts(6)
            }else if(innerWidth>1050){
                flexWidth=baseWidth/5 -24;
                setFlexCounts(5)
            }else if(innerWidth>850){
                flexWidth=baseWidth/4 -20;
                setFlexCounts(4)
            }else if(innerWidth>650){
                flexWidth=baseWidth/3 -16;
                setFlexCounts(3)
            }else if(innerWidth>400){
                flexWidth=baseWidth/2 -12;
                setFlexCounts(2)
            }else{
                flexWidth=baseWidth -8;
                setFlexCounts(1)
            }
            setEachFlexWidth(flexWidth + "px")
    }


    // inputの高さ定義用
    export const LiHeightSetting=(setLiHeight,requiredAnswer)=>{
        switch(Number(requiredAnswer)){
            case 1:
                setLiHeight("45px");
            break;
            case 3:
                setLiHeight("40px");
            break;
            case 5:
                setLiHeight("35px");
            break;
            case 11:
                setLiHeight("30px");
            break;
            case 20:
                setLiHeight("25px");
            break;
            // それ以外はエラー
            default:
                Inertia.visit("error_view");
            break;


        }

    }
