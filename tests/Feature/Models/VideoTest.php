<?php

namespace Tests\Feature\Models;

use App\Models\Video;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class VideoTest extends TestCase
{
    use DatabaseMigrations;

    public function testList()
    {
        factory(Video::class, 1)->create();
        $videos = Video::all();
        $this->assertCount(1, $videos);
        $videoKeys = array_keys($videos->first()->getAttributes());
        $this->assertEqualsCanonicalizing([
            'id',
            'title',
            'description',
            'year_launched',
            'opened',
            'rating',
            'duration',
            'created_at',
            'updated_at',
            'deleted_at'
        ], $videoKeys);
    }

    public function testCreate()
    {
        $video = Video::create([
            'title' => 'test1',
            'description' => 'desc',
            'year_launched' => 2018,
            'opened' => true,
            'rating' => 'L',
            'duration' => 125
        ]);
        $video->refresh();

        $this->assertEquals('test1', $video->title);
        $isUuidValid = preg_match('/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i', $video->id);
        $this->assertTrue((bool)$isUuidValid);

        $video = Video::create([
            'title' => 'test1',
            'description' => 'desc',
            'year_launched' => 2018,
            'opened' => true,
            'rating' => 'L',
            'duration' => 125
        ]);
        $this->assertNotEquals(1, $video->duration);
    }

    public function testUpdate()
    {
        $video = factory(Video::class)->create([
            'title' => 'test',
            'rating' => '12'
        ])->first();

        $data = [
            'title' => 'test_updated',
            'rating' => '18'
        ];
        $video->update($data);

        foreach ($data as $key => $value) {
            $this->assertEquals($value, $video->{$key});
        }
    }

    public function testDelete()
    {
        $video = factory(Video::class)->create()->first();
        $this->assertTrue($video->delete());
    }
}
