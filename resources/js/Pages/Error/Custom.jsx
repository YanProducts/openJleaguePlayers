import GuestLayout from '@/Layouts/GuestLayout';
import BaseFooterLinks from '../Components/BaseFooterLinks';
import { Link,Head } from '@inertiajs/react';
import React from 'react';

export default function Custom({message,isLocal}) {

    const [htmlMessage,setHtmlMessage]=React.useState("予期せぬエラーです")

    React.useEffect(()=>{

        // isLocalがない＝変数のエラー
        if(isLocal===null || isLocal===undefined || message===null || message===undefined){
            setHtmlMessage("予期せぬエラーです");
        }
        //本番環境下なら、エラーの種類を絞り、ないものであれば「unExpected」
        if(isLocal!=="local"){
            switch(message){
                case "defaultSetting":
                    setHtmlMessage("初期設定のエラーです");
                break;
                case "autoLogOutJsonOkError":
                    setHtmlMessage("ログアウトできません");
                break;
                case "unExpectedRoute":
                    setHtmlMessage("ルートがおかしいです");
                break;
                case "mustLogout":
                    setHtmlMessage("ログアウトが必要です");
                break;
                default:
                    setHtmlMessage("予期せぬエラーです");
                break;
                // commonUserLoginErrorは予期せぬエラーで表示
            }
        }else{
            // 開発環境化ならエラーをそのまま表示
            setHtmlMessage(message);
        }

    },[isLocal,message]);



    return (
        <GuestLayout>
            <Head title="エラーのお知らせ" />
            <div>　</div>
            <h1 className="base_h text-lg py-2"  id="toph1">エラーのお知らせ</h1>
           <div className='base_frame bg-pink-300 text-lg text-red-600  font-bold my-5 py-1 text-center'>
              <p>{htmlMessage}</p>
           </div>
           <BaseFooterLinks partNames={["topPage"]}/>
        </GuestLayout>
    );
}
