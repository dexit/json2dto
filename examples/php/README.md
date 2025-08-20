# PHP DTO Usage Examples

This directory contains comprehensive examples of how to use the generated DTOs in real-world PHP applications.

## Structure

- **DTOs/**: Generated Data Transfer Objects
- **Services/**: Business logic services that use DTOs
- **ApiController.php**: REST API controller demonstrating DTO usage
- **README.md**: This documentation

## Key Features Demonstrated

### 1. Type Safety
DTOs provide compile-time type checking and IDE autocompletion:

```php
$user = new UserDto($userData);
echo $user->name; // IDE knows this is a string
echo $user->id + 10; // IDE knows this is an int
```

### 2. Data Validation
DTOs automatically validate data structure and types:

```php
// This will throw an exception if required fields are missing
$user = new UserDto([
    'id' => 1,
    'name' => 'John',
    // Missing 'email' will cause validation error
]);
```

### 3. Nested Objects
Complex data structures with nested DTOs:

```php
$product = new ProductDto($productData);
echo $product->category->name; // Type-safe nested access
echo $product->specifications->battery_life;
```

### 4. Collections
Working with arrays of DTOs:

```php
$response = new ApiResponseDto($apiData);
foreach ($response->users as $user) {
    // $user is guaranteed to be a UserDto instance
    echo $user->name;
}
```

## Usage Patterns

### Service Layer
Services use DTOs to ensure type safety throughout the application:

```php
class UserService
{
    public function getUser(int $id): ?UserDto
    {
        $userData = $this->repository->find($id);
        return $userData ? new UserDto($userData) : null;
    }
    
    public function createUser(array $data): UserDto
    {
        // DTO validates the data structure
        $user = new UserDto($data);
        
        // Save to database
        $this->repository->save($user->toArray());
        
        return $user;
    }
}
```

### API Controllers
Controllers use DTOs to handle request/response data:

```php
public function createUser(Request $request, Response $response): Response
{
    try {
        $data = json_decode($request->getBody()->getContents(), true);
        $user = $this->userService->createUser($data);
        
        $response->getBody()->write(json_encode($user->toArray()));
        return $response->withStatus(201);
    } catch (\Exception $e) {
        // Handle validation errors
        return $response->withStatus(400);
    }
}
```

### Data Transformation
DTOs make data transformation safe and predictable:

```php
// Filter active users
$activeUsers = array_filter($users, fn(UserDto $user) => $user->is_active);

// Transform to different format
$userNames = array_map(fn(UserDto $user) => $user->name, $users);

// Calculate derived values
$discountedPrice = $product->price * 0.9;
```

## Benefits

1. **Type Safety**: Catch errors at development time, not runtime
2. **IDE Support**: Full autocompletion and refactoring support
3. **Documentation**: DTOs serve as living documentation of your data structures
4. **Validation**: Automatic validation of data structure and types
5. **Refactoring**: Safe refactoring across your entire codebase
6. **Testing**: Easier to write tests with predictable data structures

## Best Practices

1. **Use DTOs at boundaries**: APIs, database interactions, external services
2. **Keep DTOs simple**: Don't add business logic to DTOs
3. **Generate from real data**: Use actual API responses or database records
4. **Version your DTOs**: When APIs change, create new DTO versions
5. **Use nested DTOs**: For complex data structures, break them into smaller DTOs
6. **Validate early**: Create DTOs as soon as data enters your system

## Running the Examples

To run these examples:

1. Install dependencies:
   ```bash
   composer require spatie/data-transfer-object
   ```

2. Include the DTO files in your autoloader

3. Use the services and controllers in your application

4. The DTOs can be generated using the json2dto tool from the sample JSON data provided in the examples.