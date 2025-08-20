<?php

namespace App\DTO;

use Spatie\DataTransferObject\DataTransferObject;

class SpecificationsDto extends DataTransferObject
{
    public string $battery_life;
    public string $weight;
    public string $color;
}