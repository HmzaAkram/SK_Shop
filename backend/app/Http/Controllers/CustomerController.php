<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Http\Resources\SaleResource;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class CustomerController extends Controller
{
    /**
     * Lightweight index used for admin autocomplete/search.
     * Supports LIKE searches on name, phone, cnic. When search is present
     * the response is limited to 10 records and returns only required fields
     * to keep payload small.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Customer::query()
            ->withCount('sales')
            // also include count of installment sales so frontend can show status label without extra queries
            ->withCount(['sales as installment_sales_count' => function ($q) {
                $q->where('type', 'Installment');
            }]);

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('cnic', 'like', "%{$search}%");
            });

            $perPage = (int) $request->input('per_page', 10);
            $perPage = $perPage > 0 ? min($perPage, 10) : 10;

            $customers = $query->orderBy('id', 'desc')->limit($perPage)->get();

            $results = $customers->map(function (Customer $customer) {
                return [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'phone' => $customer->phone,
                    'cnic' => $customer->cnic,
                    'customer_id' => '#'.$customer->id,
                    'address_short' => Str::limit($customer->address ?? '', 80),
                    'status_label' => $customer->installment_sales_count > 0 ? 'Installment Customer' : 'Cash Customer',
                ];
            })->values();

            return response()->json([
                'success' => true,
                'message' => 'Search results',
                'data' => $results,
                'meta' => [
                    'per_page' => $perPage,
                    'count' => $results->count(),
                ],
            ]);
        }

        // Fallback to full pagination for admin listing pages
        $customers = $query->latest()->paginate(15);
        $customers->getCollection()->transform(
            fn (Customer $customer) => new CustomerResource($customer)
        );

        return response()->json([
            'success' => true,
            'message' => 'Customers fetched successfully',
            'data'    => $customers->items(),
            'meta'    => [
                'current_page' => $customers->currentPage(),
                'last_page'    => $customers->lastPage(),
                'per_page'     => $customers->perPage(),
                'total'        => $customers->total(),
            ],
        ]);
    }

    /**
     * Create customer but prevent duplicates by checking phone and CNIC first.
     * If a matching customer exists, return 409 with the existing customer so
     * frontend can prompt the user to select existing customer instead of creating a duplicate.
     */
    public function store(StoreCustomerRequest $request): JsonResponse
    {
        $data = $request->validated();

        $existingQuery = Customer::query()->where('phone', $data['phone']);
        if (!empty($data['cnic'])) {
            $existingQuery->orWhere('cnic', $data['cnic']);
        }

        $existing = $existingQuery->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'This customer already exists.',
                'data' => new CustomerResource($existing),
            ], 409);
        }

        $customer = Customer::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Customer created successfully',
            'data'    => new CustomerResource($customer),
        ], 201);
    }

    public function show(Customer $customer): JsonResponse
    {
        // Eager load sales with items.product and installments ordered so frontend can render full details
        $customer->load([
            'sales' => function ($q) {
                $q->with([
                    'items.product',
                    'installments' => fn ($iq) => $iq->orderBy('installment_number'),
                ])->latest('sale_date');
            },
        ]);

        // Build purchases using SaleResource so the full sale shape (items, installments) is returned
        $purchases = SaleResource::collection($customer->sales)->resolve();

        // Installment plans: keep a concise view for the installmets tab but keep data consistent
        $installmentPlans = $customer->sales
            ->where('type', 'Installment')
            ->map(function ($sale) {
                $installments = $sale->installments;

                $paidAmount  = (float) $sale->advance_payment
                    + (float) $installments->where('status', 'Paid')->sum('amount');
                $totalAmount = (float) $sale->total_amount;
                $remaining   = max($totalAmount - $paidAmount, 0);

                $nextPending = $installments
                    ->where('status', 'Pending')
                    ->sortBy('due_date')
                    ->first();

                $planStatus = match (true) {
                    $nextPending === null              => 'Completed',
                    $nextPending && $nextPending->due_date < now()->toDateString()   => 'Overdue',
                    $nextPending && $nextPending->due_date === now()->toDateString()  => 'Due Today',
                    default                           => 'Good',
                };

                return [
                    'id'                => $sale->invoice_number,
                    'sale_id'           => $sale->id,
                    'product'           => $sale->items->map(fn ($i) => $i->product?->name ?? 'Unknown')->implode(', '),
                    'date'              => Carbon::parse($sale->sale_date)->format('d M, Y'),
                    'status'            => $planStatus,
                    'nextDue'           => $nextPending
                                            ? Carbon::parse($nextPending->due_date)->format('d M, Y')
                                            : null,
                    'dueAmount'         => $nextPending ? (float) $nextPending->amount : 0,
                    'nextInstallmentId' => $nextPending?->id,
                    'total'             => $totalAmount,
                    'paid'              => $paidAmount,
                    'remaining'         => $remaining,
                    'monthly'           => (float) $sale->monthly_installment,
                    'months'            => $sale->total_installments,
                ];
            })->values();

        // Payment history: include down payments and paid installments with references to sale_id
        $paymentHistory = collect();

        foreach ($customer->sales as $sale) {
            if ((float) $sale->advance_payment > 0) {
                $paymentHistory->push([
                    'id'      => 'ADV-' . $sale->invoice_number,
                    'sale_id' => $sale->id,
                    'paid_date'    => $sale->sale_date,
                    'type'    => 'Down Payment',
                    'payment_method'  => 'Cash',
                    'amount'  => (float) $sale->advance_payment,
                ]);
            }

            foreach ($sale->installments->where('status', 'Paid') as $inst) {
                $paymentHistory->push([
                    'id'        => 'INS-' . $inst->id,
                    'sale_id'   => $sale->id,
                    'paid_date' => $inst->paid_date ? $inst->paid_date : null,
                    'due_date'  => $inst->due_date,
                    'installment_number' => $inst->installment_number,
                    'payment_method' => $inst->payment_method ?? 'Cash',
                    'amount'     => (float) $inst->amount,
                    'notes'      => $inst->notes ?? null,
                ]);
            }
        }

        $paymentHistory = $paymentHistory->sortByDesc(fn($p) => $p['paid_date'] ?? $p['date'] ?? $p['due_date'] ?? null)->values();

        // Outstanding balance calculation (all sales - all down payments - all paid installments)
        $outstanding = $customer->sales->sum(function ($sale) {
            $paidInstallments = $sale->installments
                ->where('status', 'Paid')
                ->sum('amount');

            return max(
                (float) $sale->total_amount
                    - (float) $sale->advance_payment
                    - (float) $paidInstallments,
                0
            );
        });

        $hasOverdue = $customer->sales->contains(function ($sale) {
            return $sale->installments
                ->where('status', 'Pending')
                ->where('due_date', '<', now()->toDateString())
                ->isNotEmpty();
        });

        // Witness structure expected by frontend
        $witness = [
            'witness_1' => [
                'full_name'   => $customer->guarantor_name ?? null,
                'phone'       => $customer->guarantor_phone ?? null,
                'cnic'        => $customer->guarantor_cnic ?? null,
                'address'     => $customer->guarantor_address ?? null,
                'relationship'=> null,
            ],
        ];

        return response()->json([
            'success' => true,
            'message' => 'Customer fetched successfully',
            'data'    => [
                'id'                  => $customer->id,
                'name'                => $customer->name,
                'phone'               => $customer->phone,
                'cnic'                => $customer->cnic,
                'address'             => $customer->address,
                'customer_since'      => $customer->created_at ? Carbon::parse($customer->created_at)->format('d M, Y') : null,
                'outstanding_balance' => (float) $outstanding,
                'status'              => $hasOverdue ? 'Overdue' : 'Good',
                'purchases'           => $purchases,
                'installments'        => $installmentPlans,
                'payments'            => $paymentHistory,
                'witness'             => $witness,
            ],
        ]);
    }

    public function update(UpdateCustomerRequest $request, Customer $customer): JsonResponse
    {
        $customer->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Customer updated successfully',
            'data'    => new CustomerResource($customer),
        ], 200);
    }

    public function destroy(Customer $customer): JsonResponse
    {
        if ($customer->sales()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete a customer with existing sales history.',
            ], 409);
        }

        $customer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Customer deleted successfully',
            'data'    => [],
        ]);
    }
}

