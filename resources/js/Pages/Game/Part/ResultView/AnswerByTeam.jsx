import React, {useState} from "react";
import { setInnerWidth,LiHeightSetting} from "./CutomStyle/ByTeam";

// 回答をチームごとに答える場合
export default function AnswerByTeam({teams,requiredAnswer,answered,openedInput,inputSets,setInputSets,inputRefs
,isAfter
}){

    // flexの数
    const [flexCounts,setFlexCounts]=React.useState("");

    const [eachFlexWidth,setEachFlexWidth]=React.useState("");

    // liのheight
    const [liHight,setLiHeight]=React.useState("30px");

    // 各チームのwidthの固定

    // 日本語入力変化中
    const isComposing=React.useRef(false)

    // 日本語入力変換中の保持
    const tempInputValue=React.useRef({});

    // 何番目のinputをfocusさせるか
    const [focusIndex,setFocusIndex]=React.useState("");

    // css設定（最初のロード終了時のみ）
    React.useEffect(()=>{
        //inputの高さ
        LiHeightSetting(setLiHeight,requiredAnswer);
        //flexの個数と長さ
        setInnerWidth(setFlexCounts,window.innerWidth,setEachFlexWidth);
        //windowがresizeされたときのflexの個数の定義
        window.addEventListener("resize",()=>{
            setInnerWidth(setFlexCounts,window.innerWidth,setEachFlexWidth);
        })
    },[])


  // 日本語入力開始
  const onInputCompositionStart = () => {
    isComposing.current = true;
  };

  // 日本語入力終了
  const onInputCompositionEnd = (total_n, e) => {
    setInputSets((prevState) => ({
        ...prevState,
        [total_n]: tempInputValue.current[total_n]// 確定された値で更新
    }));
    setFocusIndex(total_n);
    isComposing.current = false;
  };

  // 各inputが変更された時
  const onInputChange = (total_n,value) => {
    if (isComposing.current) {
    //日本語入力中のrefを変換
      tempInputValue.current[total_n]=value;
      return; // 日本語変換中は何もしない
    }
    setInputSets((prevState) => ({
      ...prevState,
      [total_n]: value,
    }));
    setFocusIndex(total_n);
  };


  // inputが変更した後、変更したinputに引き続きfocusする
    React.useEffect(()=>{
        inputRefs.current[focusIndex]?.focus();
    },[inputSets,focusIndex])

    React.useEffect(()=>{
        if(isAfter){
            // 正解表示中はinput要素を操作できないようにする
            setFocusIndex("");
        }
    },[isAfter])


    const liOrInput=(total_n,blackOrWhite)=>{
        if(Object.keys(openedInput).includes(String(total_n))){
            return(
                <li key={total_n} className="my-2 text-center  border-y w-full" style={{height:liHight,lineHeight:liHight,color:`${blackOrWhite}`,borderColor:`${blackOrWhite}`,borderStyle:'dashed'}}>
                <span className="font-bold">{openedInput[total_n]}</span>
                </li>
            )
        }else{
            return(
                // refのelは、そのDOMのこと
                <li key={total_n} className="my-2 text-center w-full"
                style={{height:liHight}}>
                <input
                type="text"
                //isAfterの間はdisabled
                disabled={isAfter}
                key={total_n} className="p-0 visible w-11/12" style={{color:"black",height:liHight,backgroundColor:isAfter ? "#f5f5f5" : "white",
                border: isAfter ? '3px dashed #d3d3d3' : '1px solid #ccc',boxSizing:"border-box"}}
                ref={(el) => (inputRefs.current[total_n] = el)}
                // 動的なvalueではなく、初期値を変更し、動的な値は素のHTMLに任せる
                defaultValue={inputSets[total_n] || ""}
                onChange={(e) => onInputChange(total_n, e.target.value)}
                //  日本語入力開始
                onCompositionStart={onInputCompositionStart}
                //  日本語入力終了
                onCompositionEnd={(e) => onInputCompositionEnd(total_n,e)}
                 />
                 </li>
            )
        }
    }


    const AnsweredLiComponents=({total_n,blackOrWhite})=>{
        const LiComponents=[]
        for(let n=0;n<Number(requiredAnswer);n++){
            LiComponents.push(
            <div key={total_n}>
                {liOrInput(total_n,blackOrWhite)}
            </div>
          )
        total_n++;
        }
        return LiComponents;
    }

    // 各チームの要素。表示のチームごとにflexで分割
    const TeamComponents=()=>{
        // 全体の要素
        const returnedByTeamComponents=[];
        // 改行ごとに分けたflex要素
        let groupComponents=[];
        let group_index=0;

        // inputもしくはliがトータルで何番目か
        let total_n=0;

        teams.forEach((team,index)=>{
            const blackOrWhite=0.299*team.red + 0.587 *team.green + 0.114*team.blue > 128 ? "black" : "white";
            // 各チームの要素
            let eachComponent=(
                <div key={index} className="border-black border-2 p-2 mx-1" style={{ backgroundColor:`rgb(${team.red},${team.green},${team.blue})`,color:`${blackOrWhite}`,width:`${eachFlexWidth}`}}>
                    <p className="text-center font-bold mb-2">{team.jpn_name}</p>
                    <ul>
                    <AnsweredLiComponents key={index} total_n={total_n} blackOrWhite={blackOrWhite}/>
                    </ul>
                </div>
            );

            // グループに、それぞれの要素を追加
            groupComponents.push(eachComponent);


            // 最後の要素の時はUIのバランスを整える
            if(index===teams.length-1){
            // 必要な追加要素の数
            const requiredFlexDivCounts=(index+1)%flexCounts === 0 ? 0 : flexCounts-(index+1)%flexCounts;
            for(let n=0; n<requiredFlexDivCounts;n++){
                let eachHiddenComponent=(
                    <div key={index+n+1} className="opacity-0" style={{width:`${eachFlexWidth}`}}>
                            <div>
                                <input className="w-full"/>
                            </div>
                    </div>
                );
                groupComponents.push(eachHiddenComponent);
                }
            }



            // flexCountで割ったあまりがflexCounts-1になる時、もしくは最後の要素の時は、flexで要素ごとにまとめる
            if(index%flexCounts===flexCounts-1 || index===teams.length-1 || flexCounts==1){
                returnedByTeamComponents.push(
                    <div key={group_index} className="flex justify-around my-3 mx-1">
                        {groupComponents}
                    </div>
                )
                // グループ番号
                group_index++;
                // グループを空に
                groupComponents=[];
            }
            // 合計数にrequiredAnswerをたす
            total_n=total_n+Number(requiredAnswer);
        })
        return(returnedByTeamComponents);
    };
    return(
        <div className="base_frame max-w-[95vw] base_backColor overflow-visible py-2">
            <TeamComponents/>
        </div>
    )
}
