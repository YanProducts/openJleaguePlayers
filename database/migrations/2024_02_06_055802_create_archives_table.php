<?php

// 過去の回答結果

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
        Schema::create('archives', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string("team");
            $table->string("full");
            $table->string("part");
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
            $table->string("season");

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('archives');
    }
};
