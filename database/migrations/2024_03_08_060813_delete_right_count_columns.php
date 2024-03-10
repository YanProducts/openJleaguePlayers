<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('results', function (Blueprint $table) {
            // クイズの正解数を削除(列挙型にするため)
            $table->dropColumn("right_part");
            $table->dropColumn("right_full");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('results', function (Blueprint $table) {
            //ロールバック用
            $table->integer("right_part")->default(0);
            $table->integer("right_full")->default(0);
        });
    }
};
