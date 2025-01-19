import { Link } from "@inertiajs/react";

// フッターのリンク集(複雑な処理を伴わないもの)
export default function BaseFooterLinks({partNames}){
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
    if(partNames.includes("changeData")){
        footerArray.push(
            <p  key={3} className="base_link_p">
                登録内容変更は<Link href={route("viewUpdateAuthInfo")} className="base_link">こちら</Link>から
            </p>
        )
    }

    // ゲーム再チャレンジ(クリア画面から)
    if(partNames.includes("challengeAgain")){
        footerArray.push(
            <p key={4} className='base_link_p'><Link className='base_link' href="/game.play">再チャレンジ</Link></p>
        )
    }

    return footerArray;
}
