<?php

namespace App\Providers;

use App\Models\{CastMember, Category, Genre};
use App\Observers\SyncModelObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Category::observe(SyncModelObserver::class);
        Genre::observe(SyncModelObserver::class);
        CastMember::observe(SyncModelObserver::class);

        \View::addExtension('html', 'blade');
    }
}
