<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BookController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('home');
    })->name('dashboard');
    
    Route::get('/books', [BookController::class, 'index'])->name('books.index');
    Route::post('/books', [BookController::class, 'store'])->name('books.store');
    Route::put('/books/{book}', [BookController::class, 'update']);
    Route::delete('/books/{book}', [BookController::class, 'destroy']);
    Route::get('/books/export', [BookController::class, 'export'])->name('books.export');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';