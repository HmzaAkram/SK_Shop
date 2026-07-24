<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    private const MAX_IMAGES = 4;

    public function index(Request $request): JsonResponse
    {
        $query = Product::with('category');

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('name', $request->string('category'));
            });
        }

        $products = $query->latest()->paginate(10);
        $products->getCollection()->transform(fn (Product $product) => new ProductResource($product));

        return response()->json([
            'success' => true,
            'message' => 'Products fetched successfully',
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $imagePaths = $this->storeUploadedImages($request);

        $product = Product::create([
            'category_id' => $validated['category_id'] ?? null,
            'name' => $validated['name'],
            'sku' => $validated['sku'] ?? null,
            'real_price' => $validated['real_price'],
            'selling_price' => $validated['selling_price'],
            'stock' => $validated['stock'],
            'alert_stock' => $validated['alert_stock'] ?? 5,
            'description' => $validated['description'] ?? null,
            'specifications' => $validated['specifications'] ?? null,
            'images' => $imagePaths,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => new ProductResource($product->load('category')),
        ], 201);
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Product fetched successfully',
            'data' => new ProductResource($product->load('category')),
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $validated = $request->validated();

        $existingImages = $product->images ?? [];
        $removeImages = $validated['remove_images'] ?? [];

        // Remove requested images from disk + array
        if (!empty($removeImages)) {
            foreach ($removeImages as $path) {
                if (in_array($path, $existingImages, true)) {
                    Storage::disk('public')->delete($path);
                }
            }
            $existingImages = array_values(array_diff($existingImages, $removeImages));
        }

        $newImagePaths = $this->storeUploadedImages($request);
        $finalImages = array_values(array_merge($existingImages, $newImagePaths));

        if (count($finalImages) > self::MAX_IMAGES) {
            // Roll back newly stored files since we're rejecting the request
            foreach ($newImagePaths as $path) {
                Storage::disk('public')->delete($path);
            }

            return response()->json([
                'success' => false,
                'message' => 'A product may have a maximum of '.self::MAX_IMAGES.' images.',
                'errors' => ['images' => ['Maximum of '.self::MAX_IMAGES.' images allowed in total.']],
            ], 422);
        }

        $product->fill([
            'category_id' => $validated['category_id'] ?? $product->category_id,
            'name' => $validated['name'] ?? $product->name,
            'sku' => array_key_exists('sku', $validated) ? $validated['sku'] : $product->sku,
            'real_price' => $validated['real_price'] ?? $product->real_price,
            'selling_price' => $validated['selling_price'] ?? $product->selling_price,
            'stock' => $validated['stock'] ?? $product->stock,
            'alert_stock' => $validated['alert_stock'] ?? $product->alert_stock,
            'description' => array_key_exists('description', $validated) ? $validated['description'] : $product->description,
            'specifications' => array_key_exists('specifications', $validated) ? $validated['specifications'] : $product->specifications,
            'images' => $finalImages,
        ]);
        $product->save();

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => new ProductResource($product->load('category')),
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        if ($product->saleItems()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete a product that already appears in sales records. It can be edited or its stock set to 0 instead.',
            ], 409);
        }

        foreach ($product->images ?? [] as $path) {
            Storage::disk('public')->delete($path);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully',
            'data' => [],
        ]);
    }

    /**
     * Store any uploaded "images" files on the public disk and return their paths.
     *
     * @return array<int, string>
     */
    private function storeUploadedImages(Request $request): array
    {
        if (!$request->hasFile('images')) {
            return [];
        }

        $paths = [];
        foreach ($request->file('images') as $file) {
            $paths[] = $file->store('products', 'public');
        }

        return $paths;
    }
}