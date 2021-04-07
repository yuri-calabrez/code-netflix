<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::group(['namespace' => 'Api', 'middleware' => ['auth', 'can:catalog-admin']], function () {
    Route::resource('categories', 'CategoryController', ['except' => ['create', 'edit']]);
    Route::delete('categories', 'CategoryController@destroyCollection');
    Route::resource('genres', 'GenreController', ['except' => ['create', 'edit']]);
    Route::delete('genres', 'GenreController@destroyCollection');
    Route::resource('cast_members', 'CastMemberController', ['except' => ['create', 'edit']]);
    Route::delete('cast_members', 'CastMemberController@destroyCollection');
    Route::resource('videos', 'VideoController', ['except' => ['create', 'edit']]);
    Route::delete('videos', 'VideoController@destroyCollection');
});
