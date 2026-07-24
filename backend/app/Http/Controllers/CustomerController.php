<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * List customers with optional search and purchase totals.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Customer::query()
            ->withCount('sales')
            ->withSum('sales', 'total_amount');

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('cnic', 'like', "%{$search}%");
            });
        }

        $customers = $query->latest()->paginate(15);
        $customers->getCollection()->transform(fn (Customer $customer) => new CustomerResource($customer));

        return response()->json([
            'success' => true,
            'message' => 'Customers fetched successfully',
            'data' => $customers->items(),
            'meta' => [
                'current_page' => $customers->currentPage(),
                'last_page' => $customers->lastPage(),
                'per_page' => $customers->perPage(),
                'total' => $customers->total(),
            ],
        ]);
    }

    public function store(StoreCustomerRequest $request): JsonResponse
    {
        $customer = Customer::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Customer created successfully',
            'data' => new CustomerResource($customer),
        ], 201);
    }

    /**
     * Show a single customer along with their full sales & installment history.
     */
    public function show(Customer $customer): JsonResponse
    {
        $customer->load(['sales' => function ($query) {
            $query->with(['items.product', 'installments'])->latest();
        }]);

        return response()->json([
            'success' => true,
            'message' => 'Customer fetched successfully',
            'data' => new CustomerResource($customer),
        ]);
    }

    public function update(UpdateCustomerRequest $request, Customer $customer): JsonResponse
    {
        $customer->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Customer updated successfully',
            'data' => new CustomerResource($customer),
        ]);
    }

    public function destroy(Customer $customer): JsonResponse
    {
        if ($customer->sales()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete a customer with existing sales history. Consider keeping the record for audit purposes.',
            ], 409);
        }

        $customer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Customer deleted successfully',
            'data' => [],
        ]);
    }
}