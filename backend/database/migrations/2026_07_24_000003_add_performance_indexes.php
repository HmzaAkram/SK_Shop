<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->index('cnic');
            $table->index('phone');
        });

        Schema::table('sales', function (Blueprint $table) {
            $table->index('sale_date');
            $table->index('type');
            $table->index(['sale_date', 'type']);
            $table->index('customer_id');
        });

        Schema::table('installments', function (Blueprint $table) {
            $table->index(['status', 'due_date']);
            $table->index('sale_id');
        });

        Schema::table('expenses', function (Blueprint $table) {
            $table->index('expense_date');
        });

        Schema::table('sale_items', function (Blueprint $table) {
            $table->index('sale_id');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->index('category_id');
            $table->index('stock');
        });
    }

    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropIndex(['cnic']);
            $table->dropIndex(['phone']);
        });

        Schema::table('sales', function (Blueprint $table) {
            $table->dropIndex(['sale_date']);
            $table->dropIndex(['type']);
            $table->dropIndex(['sale_date', 'type']);
            $table->dropIndex(['customer_id']);
        });

        Schema::table('installments', function (Blueprint $table) {
            $table->dropIndex(['status', 'due_date']);
            $table->dropIndex(['sale_id']);
        });

        Schema::table('expenses', function (Blueprint $table) {
            $table->dropIndex(['expense_date']);
        });

        Schema::table('sale_items', function (Blueprint $table) {
            $table->dropIndex(['sale_id']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['category_id']);
            $table->dropIndex(['stock']);
        });
    }
};