<?php

namespace App\Models;

use App\Traits\UuidTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CastMember extends Model
{
    use SoftDeletes, UuidTrait;

    const TYPE_DIRECTOR = 1;
    const TYPE_ACTOR = 2;
    
    protected $fillable = ['name', 'type'];

    protected $dates = ['deleted_at'];

    protected $casts = ['id' => 'string'];

    public $incrementing = false;
}
