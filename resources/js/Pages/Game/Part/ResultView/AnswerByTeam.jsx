import React, {useState} from "react";
import { setInnerWidth,LiHeightSetting } from "./CutomStyle/ByTeam";

// 回答をチームごとに答える場合
export default function AnswerByTeam({teams,requiredAnswer,answered,openedInput,inputSets,setInputSets,inputRefs}){

    // flexの数
    const [flexCounts,setFlexCounts]=React.useState("");

    // liのheight
    const [liHight,setLiHeight]=React.useState("30px");

    // 日本語入力変化中
    const isComposing=React.useRef(false)

    // 日本語入力変換中の保持
    const tempInputValue=React.useRef({});

    // 何番目のinputをfocusさせるか
    const [focusIndex,setFocusIndex]=React.useState("");



    // 回答後、開いたinput要素を入れる
    React.useEffect(()=>{
        // 全てのinput要素の数
        const totalInputCounts=requiredAnswer*teams.length;
        for(let n=0;n<totalInputCounts;n++){

        }
    },[])



    // css設定（最初のロード終了時のみ）
    React.useEffect(()=>{
        //inputの高さ
        LiHeightSetting(setLiHeight,requiredAnswer);
        //flexの個数
        setInnerWidth(setFlexCounts,window.innerWidth);
        //windowがresizeされたときのflexの個数の定義
        window.addEventListener("resize",()=>{
            setInnerWidth(setFlexCounts,window.innerWidth);
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


    const liOrInput=(total_n)=>{
        if(Object.keys(openedInput).includes(String(total_n))){
            return(
                <span>{openedInput(total_n)}</span>
            )
        }else{
            return(
                // refのelは、そのDOMのこと
                <input
                type="text"
                key={total_n} className="w-full p-0 visible" style={{color:"black",height:liHight}}
                ref={(el) => (inputRefs.current[total_n] = el)}
                // 動的なvalueではなく、初期値を変更し、動的な値は素のHTMLに任せる
                defaultValue={inputSets[total_n] || ""}
                onChange={(e) => onInputChange(total_n, e.target.value)}
                //  日本語入力開始
                onCompositionStart={onInputCompositionStart}
                //  日本語入力終了
                onCompositionEnd={(e) => onInputCompositionEnd(total_n,e)}
                 />
            )
        }
    }


    const AnsweredLiComponents=({total_n})=>{
        const LiComponents=[]
        for(let n=0;n<Number(requiredAnswer);n++){
            LiComponents.push(
            <li key={total_n} className="my-1 text-center" style={{height:liHight}}>
                {liOrInput(total_n)}
            </li>
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
            // 各チームの要素
            let eachComponent=(
                <div key={index} className="border-black border-2 p-2 w-5/6 mx-1" style={{ backgroundColor:`rgb(${team.red},${team.green},${team.blue})`,color:`${0.299*team.red + 0.587 *team.green + 0.114*team.blue > 128 ? "black" : "white"}`}}>
                    <p className="text-center font-bold mb-2">{team.jpn_name}</p>
                    <ul>
                    <AnsweredLiComponents key={index} total_n={total_n}/>
                    </ul>
                </div>
            );

            // グループに、それぞれの要素を追加
            groupComponents.push(eachComponent);


            // flexCountで割ったあまりがflexCounts-1になる時、もしくは最後の要素の時は、flexで要素ごとにまとめる
            if(index%flexCounts===flexCounts-1 || index===teams.length-1 || flexCounts==1){
                returnedByTeamComponents.push(
                    <div key={group_index} className="flex justify-around my-3">
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
