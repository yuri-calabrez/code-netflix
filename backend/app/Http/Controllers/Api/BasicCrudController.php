<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\Resources\Json\ResourceCollection;

abstract class BasicCrudController extends Controller
{
    protected $paginationSize = 15;

    protected abstract function model();

    protected abstract function rulesStore(): array;

    protected abstract function rulesUpdate(): array;

    protected abstract function resource();

    protected abstract function resourceCollection();

    public function index()
    {
        $data = !$this->paginationSize ? $this->model()::all : $this->model()::paginate($this->paginationSize);

        $resourceCollectionClass = $this->resourceCollection();
        $ref = new \ReflectionClass($this->resourceCollection());
        return $ref->isSubclassOf(ResourceCollection::class) 
            ? new $resourceCollectionClass($data) 
            : $resourceCollectionClass::collection($data);
    }

    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rulesStore());
        $obj = $this->model()::create($validatedData);
        $obj->refresh();
        $resource = $this->resource();
        return new $resource($obj);
    }

    public function show($id)
    {
        $obj = $this->findOrFail($id);
        $resource = $this->resource();
        return new $resource($obj);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $this->validate($request, $this->rulesUpdate());
        $obj = $this->findOrFail($id);
        $obj->update($validatedData);
        
        $resource = $this->resource();
        return new $resource($obj);
    }

    public function destroy($id)
    {
        $obj = $this->findOrFail($id);
        $obj->delete();

        return response()->noContent();
    }

    protected function findOrFail($id)
    {
        $model = $this->model();
        $keyName = (new $model)->getRouteKeyName();
        return $this->model()::where($keyName, $id)->firstOrFail();
    }
}
