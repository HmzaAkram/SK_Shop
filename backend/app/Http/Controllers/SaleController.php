<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSaleRequest;
use App\Http\Resources\SaleResource;
use App\Models\Sale;
use App\Services\SaleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class SaleController extends Controller
{
    public function __construct(private readonly SaleService $saleService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $query = Sale::with(['customer', 'items.product', 'installments']);

        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }

        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->integer('customer_id'));
        }

        if ($request->filled('from')) {
            $query->where('sale_date', '>=', $request->date('from')->format('Y-m-d'));
        }

        if ($request->filled('to')) {
            $query->where('sale_date', '<=', $request->date('to')->format('Y-m-d'));
        }

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($cq) use ($search) {
                        $cq->where('name', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    });
            });
        }

        $sales = $query->latest()->paginate(15);
        $sales->getCollection()->transform(fn (Sale $sale) => new SaleResource($sale));

        return response()->json([
            'success' => true,
            'message' => 'Sales fetched successfully',
            'data' => $sales->items(),
            'meta' => [
                'current_page' => $sales->currentPage(),
                'last_page' => $sales->lastPage(),
                'per_page' => $sales->perPage(),
                'total' => $sales->total(),
            ],
        ]);
    }

    public function show(Sale $sale): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Sale fetched successfully',
            'data' => new SaleResource($sale->load(['customer', 'items.product', 'installments'])),
        ]);
    }

    public function store(StoreSaleRequest $request): JsonResponse
    {
        try {
            $sale = $this->saleService->createSale($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Sale created successfully',
                'data' => new SaleResource($sale),
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create sale',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            Log::error('Sale creation failed', [
                'message' => $e->getMessage(),
                'payload' => $request->except(['customer.cnic', 'customer.guarantor_cnic']),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create sale. Please try again.',
            ], 500);
        }
    }

    public function destroy(Sale $sale): JsonResponse
    {
        try {
            $this->saleService->deleteSale($sale);

            return response()->json([
                'success' => true,
                'message' => 'Sale deleted successfully',
            ]);
        } catch (\Throwable $e) {
            Log::error('Failed to delete sale', [
                'message' => $e->getMessage(),
                'sale_id' => $sale->id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete sale. Please try again.',
            ], 500);
        }
    }
}