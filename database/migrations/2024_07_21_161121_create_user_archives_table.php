<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\NameTypeEnum;
use App\Enums\QuizTypeEnum;

return new class extends Migration
{
// ユーザーごとの成績
    public function up(): void
    {
        Schema::create('user_archives', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string("user");

            // allも含むので Enumでは宣言しない
            $table->string("cateType");

            // 以下はEnumで
            $table->enum("quizType",QuizTypeEnum::getDescriptions());
            $table->enum("nameType",NameTypeEnum::getDescriptions());


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_archives');
    }
};
