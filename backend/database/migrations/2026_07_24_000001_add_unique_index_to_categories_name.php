<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // De-duplicate any existing category names before enforcing uniqueness,
        // so the migration never fails on legacy/dev data.
        $duplicates = DB::table('categories')
            ->select('name')
            ->groupBy('name')
            ->havingRaw('COUNT(*) > 1')
            ->pluck('name');

        foreach ($duplicates as $name) {
            $rows = DB::table('categories')->where('name', $name)->orderBy('id')->get();
            foreach ($rows->skip(1) as $index => $row) {
                DB::table('categories')->where('id', $row->id)->update([
                    'name' => $row->name.' ('.($index + 2).')',
                ]);
            }
        }

        Schema::table('categories', function (Blueprint $table) {
            $table->unique('name');
        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropUnique(['name']);
        });
    }
};