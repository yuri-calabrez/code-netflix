<?php

use App\Models\Category;
use App\Models\Genre;
use Illuminate\Database\Seeder;

class GenresTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = Category::all();
        factory(Genre::class, 50)
            ->create()
            ->each(function($genre) use ($categories){
                $categoriesId = $categories->random(5)->pluck('id')->toArray();
                $genre->categories()->sync($categoriesId);
            });
    }
}
