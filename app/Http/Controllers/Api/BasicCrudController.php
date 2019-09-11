<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

abstract class BasicCrudController extends Controller
{
    private $rules = [
        'name' => 'required|max:255',
        'is_active' => 'boolean'
    ];

    protected abstract function model();

    public function index()
    {
        return $this->model()::all();
    }
}
