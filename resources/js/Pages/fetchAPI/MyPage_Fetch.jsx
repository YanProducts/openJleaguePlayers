// マイページのoptionが変化するたびにランキングを変化させる
export default function MyPageFetch(pattern,setError,setEachAnswerTotalCounts,setEachAnswerDataByTeam,setEachAnswerDataByPlayer,setClearCountData){
        const headers={
            "Content-Type":"application/json",
            // 自動送信されているが、念のため行う
           'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content || "missingToken"
        }
        fetch(
            "/fetchMyData",
            {
                method:"POST",
                headers:headers,
                body:JSON.stringify(pattern)
            }
        ).then(response=>{
            if(!response.ok){
                console.log(response)
                if(response.status=="422"){
                return response.json().then(json=>{
                    setError(json.errors);
                    throw new Error("validation");
                })
                }else{
                console.log(response.status)
                throw new Error("undefined");
                }
            }
            return response.json();
        }).then(json=>{
            if(
                json?.eachAnswerTotalCounts===undefined ||
                json?.eachAnswerDataByTeam===undefined ||
                json?.eachAnswerDataByPlayer===undefined ||
                json?.clearCountData===undefined
                ){
                    console.log(json);
                throw new Error("undefinedColumn");
            }
            setEachAnswerTotalCounts(json.eachAnswerTotalCounts)
            setEachAnswerDataByTeam(json.eachAnswerDataByTeam)
            setEachAnswerDataByPlayer(json.eachAnswerDataByPlayer)
            setClearCountData(json.clearCountData)

        }).catch(e=>{
        console.log(e)
        });
}
