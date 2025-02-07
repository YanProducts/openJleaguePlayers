import React from 'react';
import backgroundImage from '../../img/back.jpg';
import heightCheck from './ResizeWhenHeightChange';
import BaseFooterLinks from '../Pages/Components/BaseFooterLinks';

// すでにログインしているユーザー用のレイアウト
export default function AuthenticatedLayout({ user,pageName, children }) {
    // innerHighによってリンクを固定にする
    const fixedBottom=React.useRef(null);
    React.useEffect(()=>{
        window.addEventListener("resize",()=>{
            heightCheck(fixedBottom,pageName);
        })
        heightCheck(fixedBottom,pageName)
    },)

    // もう一度挑戦(クリア画面)
    const ChallengeAgainComponents=()=>
        (pageName==="Clear") ?
        (<BaseFooterLinks partNames={["challengeAgain"]}/>):(null)


    // トップページに向かうリンク(マイページ以外)
   const ToTopPageComponents=()=>
        !["TopPage","MyPage"].includes(pageName) ? (
            <BaseFooterLinks partNames={["topPage"]} />):(null)


    // マイページに向かうリンク
    const ToMyPageComponents=()=>
        (pageName!=="MyPage" && user?.name && user.name!=="commonUser" ) ? (<BaseFooterLinks partNames={["myPage"]}/>):(null);

    // マイページ専用リンク(登録内容変更含む)
    const InMyPageCoponents=()=>
    (pageName==="MyPage") ?  (<BaseFooterLinks partNames={["inMyPage"]} fixedBottom={fixedBottom}/>):(null);


    return (
        <div className="min-h-screen">
        <main className="min-h-screen pt-30" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize:"contain"}}>
                {children}
                <ChallengeAgainComponents/>
                <ToMyPageComponents/>
                <ToTopPageComponents/>
                <InMyPageCoponents/>
                <div>　</div>
            </main>
        </div>
    );
}
