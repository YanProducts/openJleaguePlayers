import { Link } from "@inertiajs/react";

// フッターのリンク集(複雑な処理を伴わないもの)
export default function BaseFooterLinks({partNames,myPageBottomPoint}){

    let footerArray=[]

    // ログインページへ
    if(partNames.includes("login")){
        footerArray.push(
            <p  key={0} className="base_link_p">
            ログインは<Link href={route("login")} className="base_link">
                    こちら
                </Link>から
            </p>
        )
    }

    // ログインページへ戻る
    if(partNames.includes("backToLogin")){
        footerArray.push(
            <p  key={1} className="base_link_p">
            <Link href={route("login")} className="base_link">
                    戻る
                </Link>
            </p>
        )
    }

    // 新規登録
    if(partNames.includes("register")){
        footerArray.push(
            <p  key={2} className="base_link_p">
            新規登録は<Link href={route('register')} className="base_link">
                    こちら
                </Link>から
            </p>
        )
    }

    // 登録内容変更
    if(partNames.includes("inMyPage")){
        footerArray.push(
            <div key={3} className={`${myPageBottomPoint} right-0 left-0 fixed`}>
                    <p className="base_link_p mx-auto"><Link className='base_link' href="/">トップへ</Link></p>
                <p className="base_link_p mx-auto">
                    登録内容変更は<Link href={route("viewUpdateAuthInfo")} className="base_link">こちら</Link>から
                </p>
            </div>
        )
    }

    // トップページへ
    if(partNames.includes("topPage")){
        footerArray.push(
        <p key={4} className="base_link_p mt-3"><Link className='base_link' href="/">トップへ</Link></p>
        )
    }

    // マイページへ
    if(partNames.includes("myPage")){
        footerArray.push(
        <p key={5} className="base_link_p mt-3"><Link className='base_link' href="/myPage">マイページへ</Link></p>
        )
    }


    // ゲーム再チャレンジ
    if(partNames.includes("challengeAgain")){
        footerArray.push(
            <p key={6} className='base_link_p'><Link className='base_link' href="/game.play">再チャレンジ</Link></p>
        )
    }

    return footerArray;
}
