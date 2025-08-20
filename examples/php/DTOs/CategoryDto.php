<?php

namespace App\DTO;

use Spatie\DataTransferObject\DataTransferObject;

class CategoryDto extends DataTransferObject
{
    public int $id;
    public string $name;
    public string $slug;
}