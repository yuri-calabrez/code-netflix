<?php

namespace App\Models;

use App\ModelFilters\CastMemberFilter;
use App\Traits\SerializeDateToIso8601Trait;
use App\Traits\UuidTrait;
use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CastMember extends Model
{
    use SoftDeletes, UuidTrait, Filterable, SerializeDateToIso8601Trait;

    const TYPE_DIRECTOR = 1;
    const TYPE_ACTOR = 2;
    
    protected $fillable = ['name', 'type'];

    protected $dates = ['deleted_at'];

    protected $casts = ['id' => 'string'];

    public $incrementing = false;
    protected $keyType = 'string';

    public static $types = [
        self::TYPE_DIRECTOR,
        self::TYPE_ACTOR,
    ];

    public function modelFilter()
    {
        return $this->provideFilter(CastMemberFilter::class);
    }
}
