<?php

// 結果の取得

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
        Schema::create('results', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string("team");
            // 結果データなので、名前はfullのみでOK
            $table->string("full");
            
            // allも含むので Enumでは宣言しない
            $table->string("cateType");
            
            // 以下はEnumで
            $table->enum("quizType",QuizTypeEnum::getDescriptions());
            $table->enum("nameType",NameTypeEnum::getDescriptions());
            
            // 以下は変更あり
            $table->string("challenger");

            // 以下は削除済
            $table->integer("right_part")->default(0);
            $table->integer("right_full")->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('results');
    }
};
