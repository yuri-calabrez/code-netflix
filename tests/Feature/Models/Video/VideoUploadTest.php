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
                'video_file' => UploadedFile::fake()->image('video.mp4'),
                'trailer_file' => UploadedFile::fake()->image('trailer.mp4'),
                'banner_file' => UploadedFile::fake()->image('banner.jpg')
            ]
        );
        \Storage::assertExists("{$video->id}/$video->thumb_file");
        \Storage::assertExists("{$video->id}/$video->video_file");
        \Storage::assertExists("{$video->id}/$video->trailer_file");
        \Storage::assertExists("{$video->id}/$video->banner_file");
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
                    'video_file' => UploadedFile::fake()->image('video.mp4'),
                    'trailer_file' => UploadedFile::fake()->image('trailer.mp4'),
                    'banner_file' => UploadedFile::fake()->image('banner.jpg')
                ]
            );
        } catch (TestException $e) {
            $this->assertCount(0, \Storage::allFiles());
            $hasError = true;
        }

        $this->assertTrue($hasError);
    }

    public function testUpdateWithFiles()
    {
        \Storage::fake();
        $video = factory(Video::class)->create();
        $thumbFile = UploadedFile::fake()->image('thumb.jpg');
        $videoFile = UploadedFile::fake()->create('video.mp4');
        $trailerFile = UploadedFile::fake()->create('trailer.mp4');
        $bannerFile = UploadedFile::fake()->create('banner.jpg');
        $video->update($this->data + [
            'thumb_file' => $thumbFile,
            'video_file' => $videoFile,
            'trailer_file' => $trailerFile,
            'banner_file' => $bannerFile
        ]);
        \Storage::assertExists("{$video->id}/$video->thumb_file");
        \Storage::assertExists("{$video->id}/$video->video_file");
        \Storage::assertExists("{$video->id}/$video->trailer_file");
        \Storage::assertExists("{$video->id}/$video->banner_file");

        $newVideoFile = UploadedFile::fake()->create('video2.mp4');
        $newBannerFile = UploadedFile::fake()->create('banner2.jpg');
        $video->update($this->data + ['video_file' => $newVideoFile, 'banner_file' => $newBannerFile]);
        \Storage::assertExists("{$video->id}/{$thumbFile->hashName()}");
        \Storage::assertExists("{$video->id}/{$newVideoFile->hashName()}");
        \Storage::assertExists("{$video->id}/{$newBannerFile->hashName()}");
        \Storage::assertMissing("{$video->id}/{$videoFile->hashName()}");
        \Storage::assertMissing("{$video->id}/{$bannerFile->hashName()}");
    }

    public function testUpdateWithRollbackFiles()
    {
        \Storage::fake();
        $video = factory(Video::class)->create();
        \Event::listen(TransactionCommitted::class, function(){
            throw new TestException();
        });
        $hasError = false;

        try {
           $video->update(
                $this->data + [
                    'thumb_file' => UploadedFile::fake()->image('image.jpg'),
                    'video_file' => UploadedFile::fake()->image('video.mp4'),
                    'trailer_file' => UploadedFile::fake()->image('trailer.mp4'),
                    'banner_file' => UploadedFile::fake()->image('banner.jpg')
                ]
            );
        } catch (TestException $e) {
            $this->assertCount(0, \Storage::allFiles());
            $hasError = true;
        }

        $this->assertTrue($hasError);
    }

    public function testFileUrlWithLocalDriver()
    {
        $fileFields = [];
        foreach (Video::$fileFields as $field) {
            $fileFields[$field] = "$field.test";
        }
        
        $video = factory(Video::class)->create($fileFields);
        $localDriver = config('filesystems.default');
        $baseUrl = config('filesystems.disks.'.$localDriver)['url'];
        foreach ($fileFields as $field => $value) {
            $fileUrl = $video->{"{$field}_url"};
            $this->assertEquals("{$baseUrl}/$video->id/$value", $fileUrl);
        }
    }

    public function testFileUrlWithGcsDriver()
    {
        $fileFields = [];
        foreach (Video::$fileFields as $field) {
            $fileFields[$field] = "$field.test";
        }
        
        $video = factory(Video::class)->create($fileFields);
        $baseUrl = config('filesystems.disks.gcs.storage_api_uri');
        \Config::set('filesystems.default', 'gcs');
        foreach ($fileFields as $field => $value) {
            $fileUrl = $video->{"{$field}_url"};
            $this->assertEquals("{$baseUrl}/$video->id/$value", $fileUrl);
        }
    }

    public function testFileUrlsIfNullWhenFieldsAreNull()
    {
        $video = factory(Video::class)->create();
        foreach (Video::$fileFields as $field) {
            $fileUrl = $video->{"{$field}_url"};
            $this->assertNull($fileUrl);
        }
    }
}