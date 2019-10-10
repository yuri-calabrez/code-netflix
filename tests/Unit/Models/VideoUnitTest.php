<?php

namespace Tests\Unit\Models;

use App\Models\Video;
use App\Traits\{UuidTrait, UploadFilesTrait};
use Illuminate\Database\Eloquent\SoftDeletes;
use Tests\TestCase;

class VideoUnitTest extends TestCase
{
    
    public function testFillableAttribute()
    {
        $video = new Video();
        $fillable = [
            'title',
            'description',
            'year_launched',
            'opened',
            'rating',
            'duration',
            'video_file'
        ];
        $this->assertEquals($fillable, $video->getFillable());
    }

    public function testCastAttribute()
    {
        $video = new Video();
        $cast = [
            'id' => 'string',
            'opened' => 'boolean',
            'year_launched' => 'integer',
            'duration' => 'integer'
        ];
        $this->assertEquals($cast, $video->getCasts());
    }

    public function testIfUseTraits()
    {
        $trais = [SoftDeletes::class, UuidTrait::class, UploadFilesTrait::class];
        $videoTraits = array_keys(class_uses(Video::class));
        $this->assertEquals($trais, $videoTraits);
    }

    public function testDatesAttribute()
    {
        $dates = ['deleted_at', 'created_at', 'updated_at'];
        $video = new Video();
        $videoDates = $video->getDates();

        foreach ($dates as $date) {
            $this->assertContains($date, $videoDates);
        }

        $this->assertCount(count($dates), $videoDates);
    }

    public function testIncrementing()
    {
        $video = new Video();
        $this->assertFalse($video->incrementing);
    }
}
