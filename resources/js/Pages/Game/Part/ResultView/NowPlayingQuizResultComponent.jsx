// クイズの形式で分かれるUI（結果表示）
import { Inertia } from "@inertiajs/inertia";
import AnswerByTeam from "./AnswerByTeam";
import AnswerRandom from "./AnswerRandom";

export const NowPlayingQuizResultComponent=({props,answered})=>{
    if(props.quiz_type.indexOf("team")!==-1){
        return(
            <AnswerByTeam answered={answered} />
        )
    }else if(props.quiz_type.indexOf("rand")!==-1){
        return(
            <AnswerRandom answered={answered}/>
        )
    }else{
        // エラーページへ遷移！
        Inertia.visit("/error/view");
        return;
    }
}
