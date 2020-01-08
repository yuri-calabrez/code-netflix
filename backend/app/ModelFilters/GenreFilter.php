<?php 

namespace App\ModelFilters;


class GenreFilter extends DefaultModelFilter
{
    protected $sortable = ['name', 'created_at'];

    public function search($search)
    {
        $this->query->where('name', 'LIKE', "%$search%");
    }
}
