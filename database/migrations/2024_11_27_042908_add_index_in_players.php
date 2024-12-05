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
        Schema::table('players', function (Blueprint $table) {
            //playersテーブルにindexをつける
            $table->index("team");
            $table->index("part");
            $table->index("full");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('players', function (Blueprint $table) {
            //
            $table->dropIndex(["players_team_index"]);
            $table->dropIndex(["players_full_index"]);
            $table->dropIndex(["players_part_index"]);
        });
    }
};
