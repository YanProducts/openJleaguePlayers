// ローカルストレージに保存したパスワードの照合
async function decryptPassword(encrypted, key) {

    // ストレージに保存されたiv(暗号化と復号に必要なランダムな値)を取り出す(Unit8Arrayで)
    const iv = new Uint8Array(encrypted.iv);
    // 暗号化されたパスワードデータ(キー、パスワード、iv(ランダム値)がセットに保存)を取り出す(Unit8Arrayで)
    const encryptedData = new Uint8Array(encrypted.data);


    //上記の暗号化データとiv(ランダム値)(共にUnit8Array)を復号(decrypt)する
    try{
        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            encryptedData
        );
        if (decrypted.byteLength === 0) {
            throw new Exception("パスワードが空です")
            return null; // 複合化に失敗した場合はnullを返す
        }
        // バイナリ形式からtext形式に直すためのオブジェクト
        const decoder = new TextDecoder();
        // 復号したパスワードを返す
        return decoder.decode(decrypted);
    }catch(e){
        // キーやパスワードの照合エラーなどは、初期パスワードを返さない
        console.log(e);
        return null;
    }

}


export default async function PasswordRetrive(){
    try{
        // 保存されたパスワード(暗号化されたパスワード、その暗号化の元となるキー、両者を紐づけるiv(ランダム値))の取り出し
        const storedEncrypted = JSON.parse(localStorage.getItem('previousEncryptedPassword')) || "";

        // 保存されたキーの取り出し
        const rawKey = new Uint8Array(JSON.parse(localStorage.getItem('previousEncryptionKey')));

        // キーを複合化する
        const key = await crypto.subtle.importKey(
        'raw',
        rawKey.buffer,
         { name: 'AES-GCM' },
         true, // ここでextractable(抽出可能)をtrueに
         ['decrypt']
        );
        // パスワードを返す(照合エラーの際はnullが返される)
        const decryptedPassword = await decryptPassword(storedEncrypted, key);
        return decryptedPassword;
    }catch(e){
        // キーやパスワードの取得エラーなどは、初期パスワードを返さない
        console.log(e);
        return null;
    }



}
