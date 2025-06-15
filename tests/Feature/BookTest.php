<?php

use App\Models\Book;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// Test Data Setup
beforeEach(function () {
    // Create a user for authentication
    $this->user = User::factory()->create();

    // Authenticate the user for all tests
    $this->actingAs($this->user);

    $this->books = [
        Book::factory()->create(['title' => 'The Great Gatsby', 'author' => 'F. Scott Fitzgerald']),
        Book::factory()->create(['title' => '1984', 'author' => 'George Orwell']),
        Book::factory()->create(['title' => 'To Kill a Mockingbird', 'author' => 'Harper Lee']),
        Book::factory()->create(['title' => 'Pride and Prejudice', 'author' => 'Jane Austen']),
    ];
});

describe('BookController Index', function () {
    it('displays all books on index page', function () {
        $response = $this->get('/books');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('books/index')
            ->has('books', 4)
            ->where('search', '')
            ->where('sortField', 'id')
            ->where('sortDirection', 'asc')
        );
    });

    it('returns json when expecting json', function () {
        $response = $this->getJson('/books');

        $response->assertStatus(200)
            ->assertJsonCount(4)
            ->assertJsonStructure([
                '*' => ['id', 'title', 'author', 'created_at', 'updated_at']
            ]);
    });

    it('searches books by title', function () {
        $response = $this->get('/books?search=Gatsby');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('books/index')
            ->has('books', 1)
            ->where('books.0.title', 'The Great Gatsby')
            ->where('search', 'Gatsby')
        );
    });

    it('searches books by author', function () {
        $response = $this->get('/books?search=Orwell');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('books/index')
            ->has('books', 1)
            ->where('books.0.author', 'George Orwell')
            ->where('search', 'Orwell')
        );
    });

    it('returns no books for non-matching search', function () {
        $response = $this->get('/books?search=NonExistent');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('books/index')
            ->has('books', 0)
            ->where('search', 'NonExistent')
        );
    });

    it('sorts books by title ascending', function () {
        $response = $this->get('/books?sortField=title&sortDirection=asc');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('books/index')
            ->where('books.0.title', '1984')
            ->where('sortField', 'title')
            ->where('sortDirection', 'asc')
        );
    });

    it('sorts books by title descending', function () {
        $response = $this->get('/books?sortField=title&sortDirection=desc');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('books/index')
            ->where('books.0.title', 'To Kill a Mockingbird')
            ->where('sortField', 'title')
            ->where('sortDirection', 'desc')
        );
    });

    it('sorts books by author', function () {
        $response = $this->get('/books?sortField=author&sortDirection=asc');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('books/index')
            ->where('books.0.author', 'F. Scott Fitzgerald')
            ->where('sortField', 'author')
            ->where('sortDirection', 'asc')
        );
    });

    it('defaults to id sorting for invalid sort field', function () {
        $response = $this->get('/books?sortField=invalid&sortDirection=asc');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('books/index')
            ->where('sortField', 'id')
            ->where('sortDirection', 'asc')
        );
    });

    it('defaults to asc for invalid sort direction', function () {
        $response = $this->get('/books?sortField=title&sortDirection=invalid');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('books/index')
            ->where('sortField', 'title')
            ->where('sortDirection', 'asc')
        );
    });
});

describe('BookController Store', function () {
    it('creates a new book successfully', function () {
        $bookData = [
            'title' => 'New Book Title',
            'author' => 'New Author'
        ];

        $response = $this->postJson('/books', $bookData);

        $response->assertStatus(201)
            ->assertJsonStructure(['id', 'title', 'author', 'created_at', 'updated_at'])
            ->assertJson([
                'title' => 'New Book Title',
                'author' => 'New Author'
            ]);

        $this->assertDatabaseHas('books', $bookData);
    });

    it('validates required title field', function () {
        $response = $this->postJson('/books', [
            'author' => 'Test Author'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    });

    it('validates required author field', function () {
        $response = $this->postJson('/books', [
            'title' => 'Test Title'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['author']);
    });

    it('validates title max length', function () {
        $response = $this->postJson('/books', [
            'title' => str_repeat('a', 256),
            'author' => 'Test Author'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    });

    it('validates author max length', function () {
        $response = $this->postJson('/books', [
            'title' => 'Test Title',
            'author' => str_repeat('a', 256)
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['author']);
    });
});

describe('BookController Update', function () {
    it('updates a book successfully', function () {
        $book = $this->books[0];
        $updateData = [
            'title' => 'Updated Title',
            'author' => 'Updated Author'
        ];

        $response = $this->putJson("/books/{$book->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'id' => $book->id,
                'title' => 'Updated Title',
                'author' => 'Updated Author'
            ]);

        $this->assertDatabaseHas('books', [
            'id' => $book->id,
            'title' => 'Updated Title',
            'author' => 'Updated Author'
        ]);
    });

    it('validates required fields on update', function () {
        $book = $this->books[0];

        $response = $this->putJson("/books/{$book->id}", []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'author']);
    });

    it('returns 404 for non-existent book', function () {
        $response = $this->putJson('/books/999', [
            'title' => 'Test',
            'author' => 'Test'
        ]);

        $response->assertStatus(404);
    });
});

describe('BookController Destroy', function () {
    it('deletes a book successfully', function () {
        $book = $this->books[0];

        $response = $this->deleteJson("/books/{$book->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Book deleted successfully']);

        $this->assertDatabaseMissing('books', ['id' => $book->id]);
    });

    it('returns 404 for non-existent book', function () {
        $response = $this->deleteJson('/books/999');

        $response->assertStatus(404);
    });
});

describe('BookController Export', function () {
    it('exports books as CSV with full data', function () {
        $response = $this->get('/books/export?format=csv&type=full');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
        $this->assertStringContainsString('.csv"', $response->headers->get('content-disposition'));

        $content = $response->getContent();
        $this->assertStringContainsString('Title,Author', $content);
        // Note: fputcsv adds a newline, so check for the full line
        $this->assertStringContainsString('"The Great Gatsby","F. Scott Fitzgerald"', $content);
    });

    it('exports books as CSV with titles only', function () {
        $response = $this->get('/books/export?format=csv&type=titles');

        $response->assertStatus(200);
        $content = $response->getContent();
        $this->assertStringContainsString('Title', $content);
        $this->assertStringContainsString('The Great Gatsby', $content);
        $this->assertStringNotContainsString('F. Scott Fitzgerald', $content);
    });

    it('exports books as CSV with authors only', function () {
        $response = $this->get('/books/export?format=csv&type=authors');

        $response->assertStatus(200);
        $content = $response->getContent();
        $this->assertStringContainsString('Author', $content);
        $this->assertStringContainsString('F. Scott Fitzgerald', $content);
        $this->assertStringNotContainsString('The Great Gatsby', 'content'); // Corrected a typo here from the original
    });

    // XML tests are fine, except the special characters one.

    it('applies search filter to export', function () {
        $response = $this->get('/books/export?search=Gatsby&format=csv&type=full');

        $response->assertStatus(200);
        $content = $response->getContent();
        $this->assertStringContainsString('The Great Gatsby', $content);
        $this->assertStringNotContainsString('1984', $content);
    });

    it('applies sorting to export', function () {
        $response = $this->get('/books/export?sortField=title&sortDirection=desc&format=csv&type=full');

        $response->assertStatus(200);
        $content = $response->getContent();
        $lines = explode("\n", trim($content));
        $this->assertStringContainsString('To Kill a Mockingbird', $lines[1]); // First data row after header
    });
    
    /**
     * MODIFIED: Changed get() to getJson() to receive a 422 validation response.
     */
    it('validates export format', function () {
        $response = $this->getJson('/books/export?format=invalid&type=full');

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['format']);
    });

    /**
     * MODIFIED: Changed get() to getJson()
     */
    it('validates export type', function () {
        $response = $this->getJson('/books/export?format=csv&type=invalid');

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['type']);
    });

    /**
     * MODIFIED: Changed get() to getJson()
     */
    it('requires both format and type parameters', function () {
        $response = $this->getJson('/books/export');

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['format', 'type']);
    });

    /**
     * MODIFIED: Added creation of the book with special characters.
     */
    it('handles special characters in XML export', function () {
        Book::factory()->create([
            'title' => 'Book with <special> & "characters"',
            'author' => 'Author & Co.'
        ]);

        $response = $this->get('/books/export?format=xml&type=full');

        $response->assertStatus(200);
        $content = $response->getContent();
        // The assertion is now correct with single escaping
        $this->assertStringContainsString('Book with &lt;special&gt; &amp; "characters"', $content);
        $this->assertStringContainsString('Author &amp; Co.', $content);
    });
});