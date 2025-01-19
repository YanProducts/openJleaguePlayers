import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from "react";
import { Link, Head } from '@inertiajs/react';
import backgroundImage from '../../../img/back.jpg';
import { Inertia } from '@inertiajs/inertia';
import BaseFooterLinks from '../Components/BaseFooterLinks';


const CountComponent=({countSets,userWhich,colorTail})=>{
  if(Object.keys(countSets).length!==0){
    return(
            <div className={`base-frame ${colorTail} border-2 border-black mb-3`}>
            <p className="py-1 font-bold text-underline border-b-2 border-black mb-1">{userWhich}のクリア</p>
            <p className="py-1 font-bold">同じカテゴリー{countSets.cate}回目</p>
            <p className="py-1 font-bold">同じクイズ形式で{countSets.quiz}回目</p>
            <p className="py-1 font-bold">同じ回答形式で{countSets.name}回目</p>
            <p className="py-1 font-bold">トータルで{countSets.all}回目</p>
        </div>
    )
  }
}


// ゲームクリアの画面
export default function clearGames(props){

  console.log(props.userName);

  // そのユーザーにおける過去の正解数
  const [userNumberSets,setUserNumberSets]=React.useState({});
  React.useEffect(()=>{
    if(props.userName!=="commonUser"){
      setUserNumberSets(props.userNumberSets);
    }
  },[props.userNumberSets]);

  // 全ユーザートータルの過去の正解数
  const [allNumberSets,setAllNumberSets]=React.useState({});
  React.useEffect(()=>{
    setAllNumberSets(props.allNumberSets);
  },[props.allNumberSets]);



    return(
     <AuthenticatedLayout
        user={props.auth.user}
        pageName="Clear"
        >
        <Head title='ゲームクリア！'></Head>

        <div>

      <div className="h-200">　</div>
        <h1 className='base_h base_h1'>ゲームクリア！</h1>

        <p className='base_frame text-lg font-bold bg-white bg-opacity-80  text-center mb-5 border-b-2 border-black'>おめでとうございます！！</p>

        <div className='base_frame bg-white bg-opacity-80  text-center mb-2'>
            <p className="font-bold">カテゴリー：{props.cate}</p>
            <p className="font-bold">クイズ形式：{props.quiz_type}</p>
            <p className="font-bold">回答形式：{props.name_type}</p>
        </div>


        <div className='base_frame bg-white bg-opacity-80  text-center mb-2'>

              <CountComponent countSets={userNumberSets} userWhich={"あなたの通算"} colorTail={"bg-sky-300"}/>

              <CountComponent countSets={allNumberSets} userWhich={"全体の通算"} colorTail={"bg-lime-300"}/>

        </div>


        <BaseFooterLinks partNames={["challengeAgain"]} />
        </div>
      </AuthenticatedLayout>
    )
}
