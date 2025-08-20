<?php

namespace App\DTO;

use Spatie\DataTransferObject\DataTransferObject;

class UserDto extends DataTransferObject
{
    public int $id;
    public string $name;
    public string $email;
    public bool $is_active;
    public string $created_at;
}