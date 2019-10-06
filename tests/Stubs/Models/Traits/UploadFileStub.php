<?php

namespace Tests\Stubs\Models\Traits;

use App\Traits\UploadFilesTrait;
use Illuminate\Database\Eloquent\Model;

class UploadFileStub extends Model
{
    use UploadFilesTrait;

    protected function uploadDir()
    {
        return "1";
    }
}