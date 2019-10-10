<?php

namespace Tests\Stubs\Models\Traits;

use App\Traits\UploadFilesTrait;
use Illuminate\Database\Eloquent\Model;

class UploadFileStub extends Model
{
    use UploadFilesTrait;

    public static $fileFields = ['file1', 'file2', 'file3'];

    protected function uploadDir()
    {
        return "1";
    }
}