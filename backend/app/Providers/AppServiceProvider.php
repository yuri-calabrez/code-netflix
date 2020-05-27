<?php

namespace App\Providers;

use App\Models\{CastMember, Category, Genre};
use App\Observers\{CastMemberObserver, CategoryObserver, GenreObserver};
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
        Category::observe(CategoryObserver::class);
        Genre::observe(GenreObserver::class);
        CastMember::observe(CastMemberObserver::class);
    }
}
