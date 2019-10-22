<?php

namespace Tests\Feature\Models\Video;

use App\Models\Video;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

abstract class BaseVideoCrudTest extends TestCase
{
    use DatabaseMigrations;

    protected $data;

    protected function setUp(): void
    {
        parent::setUp();
        $this->data = [
            'title' => 'test1',
            'description' => 'desc',
            'year_launched' => 2018,
            'rating' => Video::RATING_LIST[0],
            'duration' => 125
        ];
    }

}