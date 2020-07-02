<?php

namespace App\Traits;

use DateTime;
use DateTimeInterface;

trait SerializeDateToIso8601Trait
{
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format(DateTime::ISO8601);
    }
}