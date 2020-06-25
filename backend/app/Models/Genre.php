<?php

namespace App\Models;

use App\ModelFilters\GenreFilter;
use App\Traits\SerializeDateToIso8601Trait;
use App\Traits\UuidTrait;
use Chelout\RelationshipEvents\Concerns\HasBelongsToManyEvents;
use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Genre extends Model
{
    use SoftDeletes, UuidTrait, Filterable, SerializeDateToIso8601Trait, HasBelongsToManyEvents;

    protected $fillable = ['name', 'is_active'];

    protected $dates = ['deleted_at'];

    protected $casts = ['id' => 'string', 'is_active' => 'boolean'];

    protected $observables = [
        'belongsToManyAttached'
    ];

    public $incrementing = false;

    public function categories()
    {
        return $this->belongsToMany(Category::class)->withTrashed();
    }

    public function modelFilter()
    {
        return $this->provideFilter(GenreFilter::class);
    }
}
