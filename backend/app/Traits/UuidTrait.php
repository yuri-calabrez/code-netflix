<?php

namespace App\Traits;

use Ramsey\Uuid\Uuid;

trait UuidTrait
{
    public static function boot()
    {
        parent::boot();
        static::creating(function($obj){
            $obj->id = Uuid::uuid4()->toString();
        });
    }
}