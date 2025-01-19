import { Inertia } from '@inertiajs/inertia';

// 意図したルーティングでページに到達しているか
export default function RouteCheck(tokenForRouting){
    const headers={
        "Content-type":"application/json",
        // 自動送信されているが、念のため行う
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content || "missingToken",
    };

   const routeTokenCheck=async()=>{
        try{
            // もしtokenが合っていなければルーティングが違う
            const response=await fetch(
                "routeCheckForDataChange",{
                    method:"POST",
                    headers:headers,
                    body:JSON.stringify({
                        "tokenForRouting":tokenForRouting
                    })
                }
            )


            if(!response.ok){
                throw new Error("unExpected");
            }

            const routeCheck=await response.json();

            if(!routeCheck.isOk){
                throw new Error("unExpectedRoute");
            }
        }catch(e){
            Inertia.visit(`/error_view/?message=${encodeURIComponent(e.message)}`)
            return;
        }
    }

    routeTokenCheck();
}
