export default async function TopPage_fetch(pattern)
{

    // ヘッダー設定
    const headers=new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        // 自動送信されているが、念のため行う
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content || "missingToken"
    });

    // プロミスではなくawaitで行う
    try{
       const response= await fetch(
        "/game.decide_pattern",
            {
                method:"POST",
                headers:headers,
                body:new URLSearchParams(pattern)
        });

    if(!response.ok){
        // レスポンスにバリデーションエラーが入っていたとき、そのエラーをjsonで変換し、その後に処理を行う
        if(response.status===422){
            const returnedError=await response.json();
            throw new Error(JSON.stringify(returnedError.errors));
        }else{
        // バリデーションでない場合のエラー処理。jsonとは限らない
            throw new Error(JSON.stringify({"unCategorizedError":"不明な処理です"}));
        }
    }
    // 正常な場合、responseをjsonに変換
    return {
            "success":true,
        };
}catch(e){
    const messageObject=JSON.parse(e.message)
    return {
        "success":false,
        "errorMessage":messageObject
    };
}

}
