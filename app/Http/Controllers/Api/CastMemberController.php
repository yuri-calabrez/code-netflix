<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\CastMemberResource;
use App\Models\CastMember;

class CastMemberController extends BasicCrudController
{
    protected function model()
    {
        return CastMember::class;
    }

    protected function rulesUpdate(): array
    {
        return $this->rulesStore();
    }

    protected function rulesStore(): array
    {
        return [
            'name' => 'required|max:255',
            'type' => 'required|numeric|in:'.implode(',', [CastMember::TYPE_DIRECTOR, CastMember::TYPE_ACTOR])
        ];
    }

    protected function resourceCollection()
    {
        return $this->resource();
    }

    protected function resource()
    {
        return CastMemberResource::class;
    }
}
