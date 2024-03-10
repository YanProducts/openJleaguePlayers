<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\NameTypeEnum;
use App\Enums\QuizTypeEnum;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        // 以下のカラムを消去
        Schema::table('players', function (Blueprint $table) {
            $table->dropColumn("right_part");
            $table->dropColumn("right_full");
            $table->dropColumn("cateType");
            $table->dropColumn("quizType");
            $table->dropColumn("nameType");
            $table->dropColumn("challenger");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('players', function (Blueprint $table) {
            //ロールバック用
            $table->integer("right_part")->default(0);
            $table->integer("right_full")->default(0);
            $table->enum("quizType",QuizTypeEnum::getDescriptions());
            $table->enum("nameType",NameTypeEnum::getDescriptions());
            $table->string("challenger");
        });
    }
};
