<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Book;

class BookController extends Controller
{
    public function index()
    {
        // Logic to retrieve and display books
        $books = Book::all();  
        return Inertia::render('books/index', compact('books'));;
    }
}