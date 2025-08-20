<?php

namespace App\DTO;

use Spatie\DataTransferObject\DataTransferObject;

class PaginationDto extends DataTransferObject
{
    public int $current_page;
    public int $total_pages;
    public int $per_page;
    public int $total_items;
}