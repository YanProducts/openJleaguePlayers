export default function MypageHeightChange(myPageFetchDone,setMyPageBottomPoint){
    if(myPageFetchDone){
        setMyPageBottomPoint(window.innerWidth<315 ? "bottom-1" : "bottom-4")
    }
}
