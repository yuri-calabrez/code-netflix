<?php 

namespace App\ModelFilters;


class VideoFilter extends DefaultModelFilter
{
    protected $sortable = ['title', 'created_at'];

    public function search($search)
    {
        $this->query->where('title', 'LIKE', "%$search%");
    }
}
