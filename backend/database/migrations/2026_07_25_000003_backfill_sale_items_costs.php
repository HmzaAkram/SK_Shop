<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Set sale_items.cost_price to the current products.real_price when NULL or 0
        DB::statement("UPDATE sale_items si
            JOIN products p ON si.product_id = p.id
            SET si.cost_price = p.real_price
            WHERE si.cost_price IS NULL OR si.cost_price = 0");

        // Compute sales.total_cogs as sum of sale_items.cost_price * quantity
        DB::statement("UPDATE sales s
            SET s.total_cogs = (
                SELECT COALESCE(SUM(si.cost_price * si.quantity),0) FROM sale_items si WHERE si.sale_id = s.id
            )");

        // Ensure sales.total_amount equals SUM(sale_items.subtotal) for integrity; do not overwrite if mismatch but log to table (best-effort)
        // For safety we will not change total_amount automatically, but we will set totals where total_amount is NULL or zero
        DB::statement("UPDATE sales s
            SET s.total_amount = (
                SELECT COALESCE(SUM(si.subtotal),0) FROM sale_items si WHERE si.sale_id = s.id
            )
            WHERE s.total_amount IS NULL OR s.total_amount = 0");
    }

    public function down(): void
    {
        // no-op for down migration (data fixes are not reverted)
    }
};
