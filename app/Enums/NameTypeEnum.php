<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */

// クイズの種類のオプション
final class NameTypeEnum extends Enum
{
    const part = 0;
    const full = 1;

    //クイズの名前タイプを記した配列で変換
    public static function getDescriptions(){
        $array=[];
        foreach(self::getValues() as $value){
            array_push($array,self::getDescription($value));
        }
        return $array;
     }
}
