<?php

use Illuminate\Contracts\Console\Kernel;

$commands = [
    'config:cache',
    'event:cache'
];

$app = require __DIR__.'/../bootstrap/app.php';

$console = tap($app->make(Kernel::class))->bootstrap();

foreach ($commands as $command) {
    $console->call($command);
}