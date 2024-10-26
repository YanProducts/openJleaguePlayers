// ローカルストレージに暗号化したパスワード保存

// 暗号化したパスワードを返す
async function encryptPassword(password, key) {

    // 暗号化のために必要なUTF8のバイナリデータにテキストを変換するためのオブジェクトを設定
    const encoder = new TextEncoder();
    // 上記のオブジェクトを使って、入力されたパスワードをUTF8に変換
    const encodedPassword = encoder.encode(password);

    //ランダムの値を設定
    const RandomValue = crypto.getRandomValues(new Uint8Array(12));


    // UTF8に整えたパスワード、キー、ランダムな値から暗号化を行う(AES-GCMという、暗号化とデータの整合性を同時に提供するモードを使う場合にはiv(Initialization Vector:ランダムな値)が必要)
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: RandomValue },
        key,
        encodedPassword
    );


    // iv(ランダム文字列)とivとキーを元に暗号化されたパスワードを返す
    return { iv: Array.from(RandomValue), data: Array.from(new Uint8Array(encrypted)) };
}


// 鍵の生成
async function generateKey() {
    return crypto.subtle.generateKey(
        // AES-GCMという、暗号化とデータの整合性を同時に提供するモードを使用。256文字の長さ。
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
}

// 暗号化されたパスワードの保存
export default async function
PasswordStoreToStorage(password){

    try{
        // 鍵の生成
        const key = await generateKey();

        // ランダム文字列とランダム文字列とキーを元に暗号化されたパスワードが返ってくる（RandomValueは既に設定済）
        const encrypted = await encryptPassword(password, key);

        // ランダム値と、ランダム値とキーを元に暗号化されたパスワードの保存
        localStorage.setItem('previousEncryptedPassword', JSON.stringify(encrypted));

        //キーの保存
        const enctryptedKey=await crypto.subtle.exportKey('raw', key)
        localStorage.setItem('previousEncryptionKey', JSON.stringify(Array.from(new Uint8Array(enctryptedKey))));
    }catch(e){
        console.log(e)
        // 保存されないだけであり、特に問題はないから続行。
    }

}
