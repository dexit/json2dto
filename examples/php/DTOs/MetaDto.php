<?php

namespace App\DTO;

use Spatie\DataTransferObject\DataTransferObject;

class MetaDto extends DataTransferObject
{
    public string $request_id;
    public string $timestamp;
}