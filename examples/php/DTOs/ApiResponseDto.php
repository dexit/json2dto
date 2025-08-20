<?php

namespace App\DTO;

use Spatie\DataTransferObject\DataTransferObject;

class ApiResponseDto extends DataTransferObject
{
    /** @var UserDto[] */
    public array $users;
    
    public PaginationDto $pagination;
    public MetaDto $meta;
}