<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Controllers\Api\BasicCrudController;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Tests\Stubs\Controllers\CategoryControllerStub;
use Tests\Stubs\Models\CategoryStub;
use Tests\TestCase;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use ReflectionClass;

class BasicCrudControllerTest extends TestCase
{
    private $controller;

    protected function setUp(): void
    {
        parent::setUp();
        CategoryStub::dropTable();
        CategoryStub::createTable();

        $this->controller = new CategoryControllerStub();
    }

    protected function tearDown(): void
    {
        CategoryStub::dropTable();
        parent::tearDown();
    }

    public function testIndex()
    {
        $category = CategoryStub::create(['name' => 'name_test', 'description' => 'description_test']);
        $this->assertEquals([$category->toArray()], $this->controller->index()->toArray());

    }

  
    public function testInvalidationData()
    {
        $this->expectException(ValidationException::class);

        $request = \Mockery::mock(Request::class);
        $request
            ->shouldReceive('all')
            ->once()
            ->andReturn(['name' => '']);
        
        $this->controller->store($request);
    }

    public function testStore()
    {
        $request = \Mockery::mock(Request::class);
        $request
            ->shouldReceive('all')
            ->once()
            ->andReturn(['name' => 'test name', 'description' => 'test description']);

        $obj = $this->controller->store($request);

        $this->assertEquals(CategoryStub::find(1)->toArray(), $obj->toArray());
    }

    public function testShow()
    {
        $category = CategoryStub::create(['name' => 'name_test', 'description' => 'description_test']);
        $obj = $this->controller->show($category->id);
        $this->assertEquals($category->toArray(), $obj->toArray());
    }

    public function testUpdate()
    {
        $category = CategoryStub::create(['name' => 'test', 'description' => 'test description']);
        $request = \Mockery::mock(Request::class);
        $request
            ->shouldReceive('all')
            ->once()
            ->andReturn(['name' => 'name updated', 'description' => 'description updated']);

        $result = $this->controller->update($request, $category->id);
        $this->assertEquals($result->toArray(), CategoryStub::find(1)->toArray());
    }


    public function testDestroy()
    {
        $this->expectException(ModelNotFoundException::class);

        $category = CategoryStub::create(['name' => 'test']);
        $this->controller->destroy($category->id);

        $this->controller->show($category->id);
    }

    public function testIfFindOrFailFetchModel()
    {
        $category = CategoryStub::create(['name' => 'name_test', 'description' => 'description_test']);

        $reflectionClass = new ReflectionClass(BasicCrudController::class);
        $reflectionMethod = $reflectionClass->getMethod('findOrFail');
        $reflectionMethod->setAccessible(true);

        $result = $reflectionMethod->invokeArgs($this->controller, [$category->id]);
        $this->assertInstanceOf(CategoryStub::class, $result);
    }

 
    public function testIfFindOrFailThrowExceptionWhenIdIsInvalid()
    {
        $this->expectException(ModelNotFoundException::class);

        $reflectionClass = new ReflectionClass(BasicCrudController::class);
        $reflectionMethod = $reflectionClass->getMethod('findOrFail');
        $reflectionMethod->setAccessible(true);

        $result = $reflectionMethod->invokeArgs($this->controller, [0]);
    }
}