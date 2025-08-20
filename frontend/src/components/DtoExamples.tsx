import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { php } from '@codemirror/lang-php';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';

interface Example {
  title: string;
  description: string;
  json: string;
  dto: string;
  usage: string;
}

const examples: Example[] = [
  {
    title: 'Simple User DTO',
    description: 'Basic user data with typed properties',
    json: `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "is_active": true,
  "created_at": "2023-01-01T00:00:00Z"
}`,
    dto: `<?php

namespace App\\DTO;

use Spatie\\DataTransferObject\\DataTransferObject;

class UserDto extends DataTransferObject
{
    public int $id;
    public string $name;
    public string $email;
    public bool $is_active;
    public string $created_at;
}`,
    usage: `<?php

use App\\DTO\\UserDto;

// Create from array
$userData = [
    'id' => 1,
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'is_active' => true,
    'created_at' => '2023-01-01T00:00:00Z'
];

$user = new UserDto($userData);

// Access properties with type safety
echo $user->name; // John Doe
echo $user->id + 10; // 11 (int operation)

// Convert back to array
$array = $user->toArray();`
  },
  {
    title: 'E-commerce Product with Nested DTOs',
    description: 'Complex product structure with nested categories and pricing',
    json: `{
  "id": 123,
  "name": "Wireless Headphones",
  "description": "High-quality wireless headphones",
  "price": 199.99,
  "currency": "USD",
  "in_stock": true,
  "category": {
    "id": 5,
    "name": "Electronics",
    "slug": "electronics"
  },
  "tags": ["wireless", "audio", "bluetooth"],
  "specifications": {
    "battery_life": "30 hours",
    "weight": "250g",
    "color": "black"
  }
}`,
    dto: `<?php

namespace App\\DTO;

use Spatie\\DataTransferObject\\DataTransferObject;

class ProductDto extends DataTransferObject
{
    public int $id;
    public string $name;
    public string $description;
    public float $price;
    public string $currency;
    public bool $in_stock;
    public CategoryDto $category;
    
    /** @var string[] */
    public array $tags;
    
    public SpecificationsDto $specifications;
}

class CategoryDto extends DataTransferObject
{
    public int $id;
    public string $name;
    public string $slug;
}

class SpecificationsDto extends DataTransferObject
{
    public string $battery_life;
    public string $weight;
    public string $color;
}`,
    usage: `<?php

use App\\DTO\\ProductDto;
use App\\DTO\\CategoryDto;
use App\\DTO\\SpecificationsDto;

// Create from API response
$apiResponse = json_decode($jsonResponse, true);
$product = new ProductDto($apiResponse);

// Type-safe access to nested data
echo $product->category->name; // Electronics
echo $product->specifications->battery_life; // 30 hours

// Work with arrays
foreach ($product->tags as $tag) {
    echo $tag; // wireless, audio, bluetooth
}

// Calculate discounted price
$discountedPrice = $product->price * 0.9;

// Create new instances
$newCategory = new CategoryDto([
    'id' => 6,
    'name' => 'Audio',
    'slug' => 'audio'
]);`
  },
  {
    title: 'API Response with Collections',
    description: 'Handling API responses with arrays of objects',
    json: `{
  "users": [
    {
      "id": 1,
      "name": "Alice",
      "role": "admin"
    },
    {
      "id": 2,
      "name": "Bob",
      "role": "user"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "per_page": 10,
    "total_items": 50
  },
  "meta": {
    "request_id": "abc123",
    "timestamp": "2023-01-01T12:00:00Z"
  }
}`,
    dto: `<?php

namespace App\\DTO;

use Spatie\\DataTransferObject\\DataTransferObject;

class ApiResponseDto extends DataTransferObject
{
    /** @var UserDto[] */
    public array $users;
    
    public PaginationDto $pagination;
    public MetaDto $meta;
}

class UserDto extends DataTransferObject
{
    public int $id;
    public string $name;
    public string $role;
}

class PaginationDto extends DataTransferObject
{
    public int $current_page;
    public int $total_pages;
    public int $per_page;
    public int $total_items;
}

class MetaDto extends DataTransferObject
{
    public string $request_id;
    public string $timestamp;
}`,
    usage: `<?php

use App\\DTO\\ApiResponseDto;
use App\\DTO\\UserDto;

// Parse API response
$response = new ApiResponseDto($apiData);

// Work with collections
foreach ($response->users as $user) {
    echo "User: {$user->name} ({$user->role})\\n";
}

// Access pagination info
$hasNextPage = $response->pagination->current_page < $response->pagination->total_pages;

// Filter users by role
$admins = array_filter($response->users, fn(UserDto $user) => $user->role === 'admin');

// Transform data
$userNames = array_map(fn(UserDto $user) => $user->name, $response->users);

// Validate data structure
if (count($response->users) > $response->pagination->per_page) {
    throw new InvalidArgumentException('Too many users in response');
}`
  }
];

const DtoExamples: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState(0);
  const [activeTab, setActiveTab] = useState<'json' | 'dto' | 'usage'>('json');

  const currentExample = examples[selectedExample];

  return (
    <div className="mb-10">
      <div className="max-w-6xl mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">DTO Examples & Usage Patterns</h1>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Explore real-world examples of how to use generated DTOs in your PHP applications.
            These examples show common patterns and best practices for working with Data Transfer Objects.
          </p>
        </div>

        {/* Example Selector */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setSelectedExample(index)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedExample === index
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {example.title}
              </button>
            ))}
          </div>
        </div>

        {/* Example Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {currentExample.title}
            </h2>
            <p className="text-gray-600">
              {currentExample.description}
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <div className="flex">
              {[
                { key: 'json' as const, label: 'JSON Input' },
                { key: 'dto' as const, label: 'Generated DTO' },
                { key: 'usage' as const, label: 'Usage Example' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                    activeTab === key
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="h-96">
            {activeTab === 'json' && (
              <CodeMirror
                value={currentExample.json}
                extensions={[json()]}
                theme={oneDark}
                height="100%"
                editable={false}
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: true,
                  dropCursor: false,
                  allowMultipleSelections: false,
                  indentOnInput: false,
                  bracketMatching: true,
                  closeBrackets: false,
                  autocompletion: false,
                  highlightSelectionMatches: false,
                }}
              />
            )}
            {activeTab === 'dto' && (
              <CodeMirror
                value={currentExample.dto}
                extensions={[php()]}
                theme={oneDark}
                height="100%"
                editable={false}
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: true,
                  dropCursor: false,
                  allowMultipleSelections: false,
                  indentOnInput: false,
                  bracketMatching: true,
                  closeBrackets: false,
                  autocompletion: false,
                  highlightSelectionMatches: false,
                }}
              />
            )}
            {activeTab === 'usage' && (
              <CodeMirror
                value={currentExample.usage}
                extensions={[php()]}
                theme={oneDark}
                height="100%"
                editable={false}
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: true,
                  dropCursor: false,
                  allowMultipleSelections: false,
                  indentOnInput: false,
                  bracketMatching: true,
                  closeBrackets: false,
                  autocompletion: false,
                  highlightSelectionMatches: false,
                }}
              />
            )}
          </div>
        </div>

        {/* Best Practices Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Best Practices</h3>
          <ul className="space-y-2 text-blue-700">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Use DTOs to validate and type-check data from external sources (APIs, forms, etc.)</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Generate nested DTOs for complex data structures to maintain type safety throughout</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Use array type hints with docblocks for collections of objects</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Consider using flexible DTOs when working with dynamic or evolving APIs</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Leverage PHP 8.0+ attributes for stricter validation when using DTO v3</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DtoExamples;