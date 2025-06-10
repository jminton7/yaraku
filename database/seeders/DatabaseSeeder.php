<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Book;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        Book::factory()->create([
            'title' => 'Lord of the Rings',
            'author' => 'J.R.R. Tolkien',
        ]);

        Book::factory()->create([
            'title' => 'Harry Potter and the Philosopher\'s Stone',
            'author' => 'J.K. Rowling',
        ]);

        Book::factory()->create([
            'title' => 'The Hobbit',
            'author' => 'J.R.R. Tolkien',
        ]);

        Book::factory()->create([
            'title' => '1984',
            'author' => 'George Orwell',
        ]);

        Book::factory()->create([
            'title' => 'To Kill a Mockingbird',
            'author' => 'Harper Lee',
        ]);

        Book::factory()->create([
            'title' => 'Pride and Prejudice',
            'author' => 'Jane Austen',
        ]);

        Book::factory()->create([
            'title' => 'The Great Gatsby',
            'author' => 'F. Scott Fitzgerald',
        ]);
    }
}
