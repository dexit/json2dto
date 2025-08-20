<?php

namespace App\Services;

use App\DTO\ProductDto;
use App\DTO\CategoryDto;
use App\DTO\SpecificationsDto;

class ProductService
{
    private array $products = [];
    private array $categories = [
        ['id' => 1, 'name' => 'Electronics', 'slug' => 'electronics'],
        ['id' => 2, 'name' => 'Books', 'slug' => 'books'],
        ['id' => 3, 'name' => 'Clothing', 'slug' => 'clothing'],
    ];

    public function __construct()
    {
        $this->initializeProducts();
    }

    private function initializeProducts(): void
    {
        $this->products = [
            [
                'id' => 1,
                'name' => 'Wireless Headphones',
                'description' => 'High-quality wireless headphones with noise cancellation',
                'price' => 199.99,
                'currency' => 'USD',
                'in_stock' => true,
                'category' => ['id' => 1, 'name' => 'Electronics', 'slug' => 'electronics'],
                'tags' => ['wireless', 'audio', 'bluetooth', 'noise-cancellation'],
                'specifications' => [
                    'battery_life' => '30 hours',
                    'weight' => '250g',
                    'color' => 'black'
                ]
            ],
            [
                'id' => 2,
                'name' => 'Programming Book',
                'description' => 'Learn advanced programming concepts',
                'price' => 49.99,
                'currency' => 'USD',
                'in_stock' => true,
                'category' => ['id' => 2, 'name' => 'Books', 'slug' => 'books'],
                'tags' => ['programming', 'education', 'technology'],
                'specifications' => [
                    'pages' => '450',
                    'language' => 'English',
                    'format' => 'Paperback'
                ]
            ]
        ];
    }

    public function getProduct(int $id): ?ProductDto
    {
        $productData = array_filter($this->products, fn($product) => $product['id'] === $id);
        
        if (empty($productData)) {
            return null;
        }

        return new ProductDto(array_values($productData)[0]);
    }

    public function getAllProducts(): array
    {
        return array_map(fn($productData) => new ProductDto($productData), $this->products);
    }

    public function getProductsByCategory(int $categoryId): array
    {
        $categoryProducts = array_filter($this->products, function($product) use ($categoryId) {
            return $product['category']['id'] === $categoryId;
        });
        
        return array_map(fn($productData) => new ProductDto($productData), $categoryProducts);
    }

    public function searchProducts(string $query): array
    {
        $matchingProducts = array_filter($this->products, function($product) use ($query) {
            return stripos($product['name'], $query) !== false || 
                   stripos($product['description'], $query) !== false ||
                   in_array(strtolower($query), array_map('strtolower', $product['tags']));
        });
        
        return array_map(fn($productData) => new ProductDto($productData), $matchingProducts);
    }

    public function createProduct(array $productData): ProductDto
    {
        // Generate new ID
        $productData['id'] = max(array_column($this->products, 'id')) + 1;
        
        // Validate category exists
        $categoryExists = array_filter($this->categories, fn($cat) => $cat['id'] === $productData['category']['id']);
        if (empty($categoryExists)) {
            throw new \InvalidArgumentException('Invalid category ID');
        }

        $product = new ProductDto($productData);
        
        // Add to storage
        $this->products[] = $product->toArray();
        
        return $product;
    }

    public function updateProductPrice(int $id, float $newPrice): ?ProductDto
    {
        $productIndex = array_search($id, array_column($this->products, 'id'));
        
        if ($productIndex === false) {
            return null;
        }

        $this->products[$productIndex]['price'] = $newPrice;
        
        return new ProductDto($this->products[$productIndex]);
    }

    public function getProductsInPriceRange(float $minPrice, float $maxPrice): array
    {
        $productsInRange = array_filter($this->products, function($product) use ($minPrice, $maxPrice) {
            return $product['price'] >= $minPrice && $product['price'] <= $maxPrice;
        });
        
        return array_map(fn($productData) => new ProductDto($productData), $productsInRange);
    }

    public function getAvailableProducts(): array
    {
        $availableProducts = array_filter($this->products, fn($product) => $product['in_stock']);
        
        return array_map(fn($productData) => new ProductDto($productData), $availableProducts);
    }

    public function calculateDiscountedPrice(ProductDto $product, float $discountPercentage): float
    {
        return $product->price * (1 - $discountPercentage / 100);
    }

    public function getProductsByTag(string $tag): array
    {
        $taggedProducts = array_filter($this->products, function($product) use ($tag) {
            return in_array(strtolower($tag), array_map('strtolower', $product['tags']));
        });
        
        return array_map(fn($productData) => new ProductDto($productData), $taggedProducts);
    }
}