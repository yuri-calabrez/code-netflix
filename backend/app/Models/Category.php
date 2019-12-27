<?php

namespace App\Models;

use App\ModelFilters\CategoryFilter;
use App\Traits\UuidTrait;
use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\{Model, SoftDeletes};

class Category extends Model
{
    use SoftDeletes, UuidTrait, Filterable;

    protected $fillable = [
        'name',
        'description',
        'is_active'
    ];

    protected $dates = ['deleted_at'];

    protected $casts = ['id' => 'string', 'is_active' => 'boolean'];

    public $incrementing = false;

    public function modelFilter()
    {
        return $this->provideFilter(CategoryFilter::class);
    }
}
