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
        Schema::table('sales', function (Blueprint $table) {
            $table->string('payment_method')->nullable()->after('type'); // 'Cash' or 'Bank Transfer'
            $table->foreignId('payment_account_id')->nullable()->constrained('payment_accounts')->nullOnDelete()->after('payment_method');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropForeign(['payment_account_id']);
            $table->dropColumn(['payment_method', 'payment_account_id']);
        });
    }
};
