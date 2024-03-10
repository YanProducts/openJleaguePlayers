<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */

//  クイズの種類のEnum
final class QuizTypeEnum extends Enum
{
    const team1 =0;
    const team3 =1;
    const team5 =2;
    const team11=3;
    const team20=4;
    const rand20=5;
    const rand50=6;
    const rand100=7;
    const rand200=8;

    // クイズの種類を記した配列で変換
    public static function getDescriptions(){
        $array=[];
        foreach(self::getValues() as $value){
            array_push($array,self::getDescription($value));
        }
        return $array;
     }

}
