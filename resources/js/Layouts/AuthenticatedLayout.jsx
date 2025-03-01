import React from 'react';
import backgroundImage from '../../img/back.jpg';
import BaseFooterLinks from '../Pages/Components/BaseFooterLinks';
import MypageHeightChange from '../Pages/Utils/MyPageHeightChange';

// すでにログインしているユーザー用のレイアウト
export default function AuthenticatedLayout({ user,pageName, myPageFetchDone=false,children }) {

    // フッターの場所(MyPageの場合のみ)
    const [myPageBottomPoint,setMyPageBottomPoint]=React.useState("bottom-4");

    // innerHighによってリンクを固定にする(他の場所からもインポートするために関数定義)
    React.useEffect(()=>{
        const DOMChange_function=()=>{
            MypageHeightChange(myPageFetchDone,setMyPageBottomPoint)
        };

        DOMChange_function();
        window.addEventListener("resize",DOMChange_function)
        return()=>{
            window.removeEventListener("resize",DOMChange_function)
        }
    },[myPageFetchDone])

    // もう一度挑戦(クリア画面)
    const ChallengeAgainComponents=()=>
        (pageName==="Clear") ?
        (<BaseFooterLinks partNames={["challengeAgain"]}/>):(null)


    // トップページに向かうリンク(マイページ以外)
   const ToTopPageComponents=()=>
        !["TopPage","MyPage","MyPageFullView"].includes(pageName) ? (
            <BaseFooterLinks partNames={["topPage"]} />):(null)


    // マイページに向かうリンク
    const ToMyPageComponents=()=>
        (!["Mypage","MyPageFullView"].includes(pageName) && user?.name && user.name!=="commonUser" ) ? (<BaseFooterLinks partNames={["myPage"]}/>):(null);

    // マイページ専用リンク(登録内容変更含む)
    const InMyPageCoponents=()=>
    (pageName==="MyPage") ?  (<BaseFooterLinks partNames={["inMyPage"]} myPageBottomPoint={myPageBottomPoint}/>):(null);

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
