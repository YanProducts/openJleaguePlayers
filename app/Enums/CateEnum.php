<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */

//  カテゴリー選択のEnum
// チームのテーブルで使うが、クイズ選択ではallを含むので使用しない

final class CateEnum extends Enum
{
    const J1 = 0;
    const J2 = 1;
    const J3 = 2;

    //全部のカテゴリーを記した配列で変換
    public static function getDescriptions(){
        $array=[];
        foreach(self::getValues() as $value){
            array_push($array,self::getDescription($value));
        }
        return $array;
    }
}
