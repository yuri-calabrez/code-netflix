<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Video;

class VideoController extends BasicCrudController
{
    private $rules;

    protected function model()
    {
        return Video::class;
    }

    protected function rulesStore(): array
    {
        return $this->rules;
    }

    protected function rulesUpdate(): array
    {
        return $this->rules;
    }
}
