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
        Schema::table('users', function (Blueprint $table) {
            //emailなどのカラムの消去
            $table->dropColumn("email");
            $table->dropColumn("email_verified_at");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //エラー時のコールバック
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
        });
    }
};
