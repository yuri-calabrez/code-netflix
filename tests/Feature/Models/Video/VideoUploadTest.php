<?php

namespace Tests\Feature\Models\Video;

use App\Models\Video;
use Illuminate\Database\Events\TransactionCommitted;
use Illuminate\Http\UploadedFile;
use Tests\Exceptions\TestException;

class VideoUploadTest extends BaseVideoCrudTest
{
    public function testCreateWithFiles()
    {
        \Storage::fake();
        $video = Video::create(
            $this->data + [
                'thumb_file' => UploadedFile::fake()->image('image.jpg'),
                'video_file' => UploadedFile::fake()->image('video.mp4')
            ]
        );
        \Storage::assertExists("{$video->id}/$video->thumb_file");
        \Storage::assertExists("{$video->id}/$video->video_file");
    }

    public function testCreateWithRollbackFiles()
    {
        \Storage::fake();
        \Event::listen(TransactionCommitted::class, function(){
            throw new TestException();
        });
        $hasError = false;

        try {
            Video::create(
                $this->data + [
                    'thumb_file' => UploadedFile::fake()->image('image.jpg'),
                    'video_file' => UploadedFile::fake()->image('video.mp4')
                ]
            );
        } catch (TestException $e) {
            $this->assertCount(0, \Storage::allFiles());
            $hasError = true;
        }

        $this->assertTrue($hasError);
    }
}