import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from "react";
import { Link, Head } from '@inertiajs/react';
import backgroundImage from '../../../img/back.jpg';
import { Inertia } from '@inertiajs/inertia';

// ゲームクリアの画面
export default function clearGames(props){
    return(
     <AuthenticatedLayout
        user={props.auth.user}
        >
        <Head title='ゲームクリア！'></Head>

        <div className="h-full pt-30" style={{ backgroundImage: `url(${backgroundImage})`,
         backgroundSize:"contain"}}>

      <div className="h-200">　</div>
        <h1 className='base_h base_h1'>ゲームクリア！</h1>

        <p className='base_frame text-lg font-bold bg-white bg-opacity-80  text-center mb-5 border-b-2 border-black'>おめでとうございます！！</p>

        <div className='base_frame bg-white bg-opacity-80  text-center mb-2'>
            <p>カテゴリー：{props.cate}</p>
            <p>クイズ形式：{props.quiz_type}</p>
            <p>回答形式：{props.name_type}</p>
        </div>

        <div className='base_frame bg-white bg-opacity-80  text-center mb-2'>
            <div>
              <p className="">あなたのクリア</p>
              <p className="">同じカテゴリー回目</p>
              <p className="">同じクイズ形式で回目</p>
              <p className="">同じ回答形式で回目</p>
              <p className="">通算で回目</p>
            </div>

            <p>同じパターンのクイズのクリアは、全体で回目</p>
            <p>うち回があなたです！</p>
        </div>


        <div>
            <p className='base_link_p'><Link className='base_link' href="/game.play">再チャレンジ</Link></p>
            <p className='base_link_p'><Link className='base_link' href="/topPage">トップへ</Link></p>
        </div>
        </div>
      </AuthenticatedLayout>
    )
}
