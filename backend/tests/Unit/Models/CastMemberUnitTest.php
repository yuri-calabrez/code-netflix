<?php

namespace Tests\Unit\Models;

use App\Models\CastMember;
use App\Traits\UuidTrait;
use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tests\TestCase;

class CastMemberUnitTest extends TestCase
{
    
    public function testFillableAttribute()
    {
        $castMember = new CastMember();
        $fillable = ['name', 'type'];
        $this->assertEquals($fillable, $castMember->getFillable());
    }

    public function testCastAttribute()
    {
        $castMember = new CastMember();
        $cast = ['id' => 'string'];
        $this->assertEquals($cast, $castMember->getCasts());
    }

    public function testIfUseTraits()
    {
        $trais = [SoftDeletes::class, UuidTrait::class, Filterable::class];
        $catMemberTraits = array_keys(class_uses(CastMember::class));
        $this->assertEquals($trais, $catMemberTraits);
    }

    public function testDatesAttribute()
    {
        $dates = ['deleted_at', 'created_at', 'updated_at'];
        $castMember = new CastMember();
        $castMemberDates = $castMember->getDates();

        foreach ($dates as $date) {
            $this->assertContains($date, $castMemberDates);
        }

        $this->assertCount(count($dates), $castMemberDates);
    }
}
