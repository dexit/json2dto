<?php

namespace App\Controllers;

use App\Services\UserService;
use App\Services\ProductService;
use App\DTO\UserDto;
use App\DTO\ProductDto;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ApiController
{
    private UserService $userService;
    private ProductService $productService;

    public function __construct(UserService $userService, ProductService $productService)
    {
        $this->userService = $userService;
        $this->productService = $productService;
    }

    public function getUsers(Request $request, Response $response): Response
    {
        $queryParams = $request->getQueryParams();
        $page = (int) ($queryParams['page'] ?? 1);
        $perPage = (int) ($queryParams['per_page'] ?? 10);

        $result = $this->userService->getAllUsers($page, $perPage);
        
        // Convert DTOs to arrays for JSON response
        $responseData = [
            'users' => array_map(fn(UserDto $user) => $user->toArray(), $result->users),
            'pagination' => $result->pagination->toArray(),
            'meta' => $result->meta->toArray()
        ];

        $response->getBody()->write(json_encode($responseData));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function getUser(Request $request, Response $response, array $args): Response
    {
        $userId = (int) $args['id'];
        $user = $this->userService->getUser($userId);

        if (!$user) {
            $response->getBody()->write(json_encode(['error' => 'User not found']));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode($user->toArray()));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function createUser(Request $request, Response $response): Response
    {
        $data = json_decode($request->getBody()->getContents(), true);

        try {
            // Validate required fields
            $requiredFields = ['name', 'email', 'is_active'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field])) {
                    throw new \InvalidArgumentException("Missing required field: {$field}");
                }
            }

            $user = $this->userService->createUser($data);
            
            $response->getBody()->write(json_encode($user->toArray()));
            return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }
    }

    public function updateUser(Request $request, Response $response, array $args): Response
    {
        $userId = (int) $args['id'];
        $data = json_decode($request->getBody()->getContents(), true);

        $user = $this->userService->updateUser($userId, $data);

        if (!$user) {
            $response->getBody()->write(json_encode(['error' => 'User not found']));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode($user->toArray()));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function searchUsers(Request $request, Response $response): Response
    {
        $queryParams = $request->getQueryParams();
        $query = $queryParams['q'] ?? '';

        if (empty($query)) {
            $response->getBody()->write(json_encode(['error' => 'Search query is required']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $users = $this->userService->searchUsers($query);
        $responseData = array_map(fn(UserDto $user) => $user->toArray(), $users);

        $response->getBody()->write(json_encode($responseData));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function getProducts(Request $request, Response $response): Response
    {
        $queryParams = $request->getQueryParams();
        
        if (isset($queryParams['category'])) {
            $products = $this->productService->getProductsByCategory((int) $queryParams['category']);
        } elseif (isset($queryParams['tag'])) {
            $products = $this->productService->getProductsByTag($queryParams['tag']);
        } elseif (isset($queryParams['available'])) {
            $products = $this->productService->getAvailableProducts();
        } else {
            $products = $this->productService->getAllProducts();
        }

        $responseData = array_map(fn(ProductDto $product) => $product->toArray(), $products);

        $response->getBody()->write(json_encode($responseData));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function getProduct(Request $request, Response $response, array $args): Response
    {
        $productId = (int) $args['id'];
        $product = $this->productService->getProduct($productId);

        if (!$product) {
            $response->getBody()->write(json_encode(['error' => 'Product not found']));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode($product->toArray()));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function searchProducts(Request $request, Response $response): Response
    {
        $queryParams = $request->getQueryParams();
        $query = $queryParams['q'] ?? '';

        if (empty($query)) {
            $response->getBody()->write(json_encode(['error' => 'Search query is required']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $products = $this->productService->searchProducts($query);
        $responseData = array_map(fn(ProductDto $product) => $product->toArray(), $products);

        $response->getBody()->write(json_encode($responseData));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function createProduct(Request $request, Response $response): Response
    {
        $data = json_decode($request->getBody()->getContents(), true);

        try {
            $requiredFields = ['name', 'description', 'price', 'currency', 'category', 'specifications'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field])) {
                    throw new \InvalidArgumentException("Missing required field: {$field}");
                }
            }

            $product = $this->productService->createProduct($data);
            
            $response->getBody()->write(json_encode($product->toArray()));
            return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }
    }

    public function updateProductPrice(Request $request, Response $response, array $args): Response
    {
        $productId = (int) $args['id'];
        $data = json_decode($request->getBody()->getContents(), true);

        if (!isset($data['price'])) {
            $response->getBody()->write(json_encode(['error' => 'Price is required']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $product = $this->productService->updateProductPrice($productId, (float) $data['price']);

        if (!$product) {
            $response->getBody()->write(json_encode(['error' => 'Product not found']));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode($product->toArray()));
        return $response->withHeader('Content-Type', 'application/json');
    }
}