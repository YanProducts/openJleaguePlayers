import { Link } from '@inertiajs/react';
import React from 'react';
import backgroundImage from '../../img/back.jpg';
import heightCheck from './ResizeWhenHeightChange';

export default function AuthenticatedLayout({ user, header, pageName, children }) {
    // innerHighによってリンクを固定にする
    const fixedBottom=React.useRef(null);
    React.useEffect(()=>{
        window.addEventListener("resize",()=>{
            heightCheck(fixedBottom,pageName);
        })
        heightCheck(fixedBottom,pageName)
    },)

    // トップページ用のリンク
   const ToTopPageComponents=()=>
        pageName!=="TopPage" ? (
            <p className="base_link_p bottom-4 right-0 left-0 mx-auto" ref={fixedBottom}><Link className='base_link' href="/topPage">トップへ</Link></p>
        ):(
            null
        )


    // マイページ用のリンク
    const ToMyPageComponents=()=>
        (pageName!=="MyPage" && user?.name && user.name!=="commonUser" )? (
            <p className="base_link_p mt-3"><Link className='base_link' href="/myPage">マイページへ</Link></p>
        ):(
            null
    );

    return (
        <div className="min-h-screen">
        <main className="min-h-screen pt-30" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize:"contain"}}>
                {children}
                <ToMyPageComponents/>
                <ToTopPageComponents/>
                <div>　</div>
            </main>
        </div>
    );
}
