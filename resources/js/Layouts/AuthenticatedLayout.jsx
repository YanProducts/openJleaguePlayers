import { Link } from '@inertiajs/react';
import React from 'react';
import backgroundImage from '../../img/back.jpg';

export default function AuthenticatedLayout({ user, header, pageName, children }) {

    // トップページ用のリンク
   const ToTopPageComponents=()=>
        pageName!=="TopPage" ? (
            <p className='base_link_p'><Link className='base_link' href="/topPage">トップへ</Link></p>
        ):(
            null
        )


    // マイページ用のリンク
    const ToMyPageComponents=()=>
        (pageName!=="MyPage" && user.name!=="commonUser" )? (
            <p className='base_link_p'><Link className='base_link' href="/myPage">マイページへ</Link></p>
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
