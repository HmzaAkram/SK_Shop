<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * sale_items.product_id was originally set to CASCADE on delete, meaning
     * deleting a product would silently wipe historical sale line-items —
     * corrupting financial/sales records. Switch it to RESTRICT so a product
     * that has ever been sold cannot be deleted at the database level either
     * (the application layer already blocks this in ProductController@destroy).
     */
    public function up(): void
    {
        Schema::table('sale_items', function (Blueprint $table) {
            $table->dropForeign(['product_id']);
        });

        Schema::table('sale_items', function (Blueprint $table) {
            $table->foreign('product_id')
                ->references('id')->on('products')
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('sale_items', function (Blueprint $table) {
            $table->dropForeign(['product_id']);
        });

        Schema::table('sale_items', function (Blueprint $table) {
            $table->foreign('product_id')
                ->references('id')->on('products')
                ->cascadeOnDelete();
        });
    }
};