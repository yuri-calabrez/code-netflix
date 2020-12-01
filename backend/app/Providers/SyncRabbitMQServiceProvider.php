<?php

namespace App\Providers;

use App\Models\{CastMember, Category, Genre};
use App\Observers\SyncModelObserver;
use Illuminate\Support\ServiceProvider;

class SyncRabbitMQServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        if (env('SYNC_RABBITMQ_ENABLE') !== true) {
            return;
        }
        
        Category::observe(SyncModelObserver::class);
        Genre::observe(SyncModelObserver::class);
        CastMember::observe(SyncModelObserver::class);
    }
}
