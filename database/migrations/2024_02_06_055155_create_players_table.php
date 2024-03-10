<?php

// 選手データの取得

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
        Schema::create('players', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string("team");
            $table->string("full");
            $table->string("part");

            // 以下は削除済(resultsファイルに格納)
            $table->integer("right_part")
            ->default(0);
            $table->integer("right_full")
            ->default(0);

            // allも含むので Enumでは宣言しない
            $table->string("cateType");

            // 以下はEnumで
            $table->enum("quizType",QuizTypeEnum::getDescriptions());
            $table->enum("nameType",NameTypeEnum::getDescriptions());
            
            $table->string("challenger");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('players');
    }
};
