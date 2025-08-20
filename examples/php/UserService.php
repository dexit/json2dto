<?php

namespace App\Services;

use App\DTO\UserDto;
use App\DTO\ApiResponseDto;
use App\DTO\PaginationDto;
use App\DTO\MetaDto;

class UserService
{
    private array $users = [
        ['id' => 1, 'name' => 'Alice Johnson', 'email' => 'alice@example.com', 'is_active' => true, 'created_at' => '2023-01-15T10:30:00Z'],
        ['id' => 2, 'name' => 'Bob Smith', 'email' => 'bob@example.com', 'is_active' => true, 'created_at' => '2023-02-20T14:45:00Z'],
        ['id' => 3, 'name' => 'Charlie Brown', 'email' => 'charlie@example.com', 'is_active' => false, 'created_at' => '2023-03-10T09:15:00Z'],
    ];

    public function getUser(int $id): ?UserDto
    {
        $userData = array_filter($this->users, fn($user) => $user['id'] === $id);
        
        if (empty($userData)) {
            return null;
        }

        return new UserDto(array_values($userData)[0]);
    }

    public function getAllUsers(int $page = 1, int $perPage = 10): ApiResponseDto
    {
        $offset = ($page - 1) * $perPage;
        $paginatedUsers = array_slice($this->users, $offset, $perPage);
        
        // Convert to DTOs
        $userDtos = array_map(fn($userData) => new UserDto($userData), $paginatedUsers);
        
        return new ApiResponseDto([
            'users' => $userDtos,
            'pagination' => new PaginationDto([
                'current_page' => $page,
                'total_pages' => ceil(count($this->users) / $perPage),
                'per_page' => $perPage,
                'total_items' => count($this->users)
            ]),
            'meta' => new MetaDto([
                'request_id' => uniqid('req_'),
                'timestamp' => date('c')
            ])
        ]);
    }

    public function createUser(array $userData): UserDto
    {
        // Validate and create user
        $userData['id'] = max(array_column($this->users, 'id')) + 1;
        $userData['created_at'] = date('c');
        
        $user = new UserDto($userData);
        
        // Add to storage (in real app, this would be database)
        $this->users[] = $user->toArray();
        
        return $user;
    }

    public function updateUser(int $id, array $updateData): ?UserDto
    {
        $userIndex = array_search($id, array_column($this->users, 'id'));
        
        if ($userIndex === false) {
            return null;
        }

        // Merge update data with existing user data
        $this->users[$userIndex] = array_merge($this->users[$userIndex], $updateData);
        
        return new UserDto($this->users[$userIndex]);
    }

    public function getActiveUsers(): array
    {
        $activeUsers = array_filter($this->users, fn($user) => $user['is_active']);
        
        return array_map(fn($userData) => new UserDto($userData), $activeUsers);
    }

    public function searchUsers(string $query): array
    {
        $matchingUsers = array_filter($this->users, function($user) use ($query) {
            return stripos($user['name'], $query) !== false || 
                   stripos($user['email'], $query) !== false;
        });
        
        return array_map(fn($userData) => new UserDto($userData), $matchingUsers);
    }
}