import { Inertia } from "@inertiajs/inertia"

    // flexの長さの定義用
    export const setInnerWidth=(setFlexCounts,innerWidth)=>{
            if(innerWidth>1200){
                setFlexCounts(7)
            }else if(innerWidth>1000){
                setFlexCounts(6)
            }else if(innerWidth>800){
                setFlexCounts(5)
            }else if(innerWidth>600){
                setFlexCounts(4)
            }else if(innerWidth>400){
                setFlexCounts(3)
            }else if(innerWidth>300){
                setFlexCounts(2)
            }else{
                setFlexCounts(1)
            }
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
