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
        //teamとeng_nameをrelationで設定するにはindexの付与が必要
        Schema::table('teams', function (Blueprint $table) {
            $table->index("eng_name");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('teams', function (Blueprint $table) {
            //
            $table->dropIndex("eng_name");
        });
    }
};
