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
        // 挑戦者にdefaultを設定
        Schema::table('results', function (Blueprint $table) {
            $table->string("challenger")->default("Guest")->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('results', function (Blueprint $table) {
            //ロールバック用
            $table->string("challenger")->change();
        });
    }
};
