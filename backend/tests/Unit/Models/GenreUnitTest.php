<?php

namespace Tests\Unit\Models;

use App\Models\Genre;
use App\Traits\UuidTrait;
use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tests\TestCase;

class GenreUnitTest extends TestCase
{
    
    public function testFillableAttribute()
    {
        $genre = new Genre();
        $fillable = ['name', 'is_active'];
        $this->assertEquals($fillable, $genre->getFillable());
    }

    public function testCastAttribute()
    {
        $genre = new Genre();
        $cast = ['id' => 'string', 'is_active' => 'boolean'];
        $this->assertEquals($cast, $genre->getCasts());
    }

    public function testIfUseTraits()
    {
        $trais = [SoftDeletes::class, UuidTrait::class, Filterable::class];
        $genreTraits = array_keys(class_uses(Genre::class));
        $this->assertEquals($trais, $genreTraits);
    }

    public function testDatesAttribute()
    {
        $dates = ['deleted_at', 'created_at', 'updated_at'];
        $genre = new Genre();
        $genreDates = $genre->getDates();

        foreach ($dates as $date) {
            $this->assertContains($date, $genreDates);
        }

        $this->assertCount(count($dates), $genreDates);
    }
}
