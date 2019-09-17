<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Controllers\Api\BasicCrudController;
use Tests\Stubs\Controllers\CategoryControllerStub;
use Tests\Stubs\Models\CategoryStub;
use Tests\TestCase;
use Illuminate\Http\Request;
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

    /**
     * @expectedException \Illuminate\Validation\ValidationException
     */
    public function testInvalidationData()
    {
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
        $category = CategoryStub::create(['name' => 'test']);
        $request = \Mockery::mock(Request::class);
        $request
            ->shouldReceive('all')
            ->once()
            ->andReturn(['name' => 'test name']);

        $obj = $this->controller->update($request, $category->id);
    }

    /**
     * @expectedException \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function testDestroy()
    {
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

     /**
     * @expectedException \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function testIfFindOrFailThrowExceptionWhenIdIsInvalid()
    {
        $reflectionClass = new ReflectionClass(BasicCrudController::class);
        $reflectionMethod = $reflectionClass->getMethod('findOrFail');
        $reflectionMethod->setAccessible(true);

        $result = $reflectionMethod->invokeArgs($this->controller, [0]);
    }
}