<?php

namespace Tests\Feature\Http\Controllers\Api\VideoController;

use App\Models\{Category, Genre, Video};
use Illuminate\Http\UploadedFile;
use Tests\Traits\TestValidations;

class VideoControllerUploadsTest extends BaseVideoControllerTestCase
{
    use TestValidations;

    public function testInvalidationVideoUploadType()
    {
        $file = UploadedFile::fake()->create('test.img');
        $data = ['video_file' => $file];
        $this->assertInvalidationInStoreAction($data, 'mimetypes', ['values' => 'video/mp4']);
        $this->assertInvalidationInUpdateAction($data, 'mimetypes', ['values' => 'video/mp4']);
    }

    public function testInvalidationVideoUploadSize()
    {
        $file = UploadedFile::fake()->create('test.mp4')->size(Video::MAX_VIDEO_SIZE + 1);
        $data = ['video_file' => $file];
        $this->assertInvalidationInStoreAction($data, 'max.file', ['max' => Video::MAX_VIDEO_SIZE]);
        $this->assertInvalidationInUpdateAction($data, 'max.file', ['max' => Video::MAX_VIDEO_SIZE]);

        $file = UploadedFile::fake()->create('test.jpg')->size(Video::MAX_THUMB_SIZE + 1);
        $data = ['thumb_file' => $file];
        $this->assertInvalidationInStoreAction($data, 'max.file', ['max' => Video::MAX_THUMB_SIZE]);
        $this->assertInvalidationInUpdateAction($data, 'max.file', ['max' => Video::MAX_THUMB_SIZE]);

        $file = UploadedFile::fake()->create('trailer.mp4')->size(Video::MAX_TRAILER_SIZE + 1);
        $data = ['trailer_file' => $file];
        $this->assertInvalidationInStoreAction($data, 'max.file', ['max' => Video::MAX_TRAILER_SIZE]);
        $this->assertInvalidationInUpdateAction($data, 'max.file', ['max' => Video::MAX_TRAILER_SIZE]);

        $file = UploadedFile::fake()->create('banner.jpg')->size(Video::MAX_BANNER_SIZE + 1);
        $data = ['banner_file' => $file];
        $this->assertInvalidationInStoreAction($data, 'max.file', ['max' => Video::MAX_BANNER_SIZE]);
        $this->assertInvalidationInUpdateAction($data, 'max.file', ['max' => Video::MAX_BANNER_SIZE]);

    }


    public function testStoreWithVideoUpload()
    {
        $category = factory(Category::class)->create();
        $genre = factory(Genre::class)->create();
        $genre->categories()->sync($category->id);

        \Storage::fake();
        $files = $this->getFiles();
        $response = $this->json('POST', $this->routeStore(), $this->sendData + [
            'categories_id' => [$category->id],
            'genres_id' => [$genre->id]
        ] + $files);
        $response->assertStatus(201);

        $id = $response->json('id');
        foreach ($files as $file) {
            \Storage::assertExists("{$id}/{$file->hashName()}");
        }
        
    }

    public function testUpdateWithVideoUpload()
    {
        $category = factory(Category::class)->create();
        $genre = factory(Genre::class)->create();
        $genre->categories()->sync($category->id);

        \Storage::fake();
        $files = $this->getFiles();
        $response = $this->json('PUT', $this->routeUpdate(), $this->sendData + [
            'categories_id' => [$category->id],
            'genres_id' => [$genre->id]
        ] + $files);

        $response->assertStatus(200);

        $id = $response->json('id');
        foreach ($files as $file) {
            \Storage::assertExists("{$id}/{$file->hashName()}");
        }
        
    }

    protected function getFiles()
    {
        return [
            'video_file' => UploadedFile::fake()->create('test.mp4')
        ];
    }

    protected function routeStore()
    {
        return route('videos.store');
    }

    protected function routeUpdate()
    {
        return route('videos.update', ['video' => $this->video->id]);
    }

    protected function model()
    {
        return Video::class;
    }
}