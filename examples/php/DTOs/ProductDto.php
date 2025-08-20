<?php

namespace App\DTO;

use Spatie\DataTransferObject\DataTransferObject;

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