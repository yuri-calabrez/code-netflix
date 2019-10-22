<?php

namespace Tests\Feature\Models\Traits;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\Stubs\Models\Traits\UploadFileStub;
use Tests\TestCase;

class UploadFileTest extends TestCase
{
    use DatabaseMigrations;

    private $obj;

    protected function setUp(): void
    {
        parent::setUp();
        $this->obj = new UploadFileStub();
        UploadFileStub::dropTable();
        UploadFileStub::makeTable();
    }


    public function testMakeOldFilesOnSaving()
    {
        $this->obj->fill([
            'name' => 'test',
            'file1' => 'test.mp4',
            'file2' => 'test2.mp4'
        ]);
        $this->obj->save();

        $this->assertCount(0, $this->obj->oldFiles);

        $this->obj->update([
            'name' => 'test3',
            'file2' => 'test3.mp4'
        ]);

        $this->assertEqualsCanonicalizing(['test2.mp4'], $this->obj->oldFiles);
    }

    public function testMakeOldFilesNullOnSave()
    {
        $this->obj->fill([
            'name' => 'test'
        ]);
        $this->obj->save();

        $this->obj->update([
            'name' => 'test3',
            'file2' => 'test3.mp4'
        ]);

        $this->assertEqualsCanonicalizing([], $this->obj->oldFiles);
    }



}
