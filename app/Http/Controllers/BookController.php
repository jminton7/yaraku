<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Book;

class BookController extends Controller
{
    public function index()
    {
        $books = Book::all(); 
        return Inertia::render('books/index', compact('books'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
        ]);

        $book = Book::create($request->only('title', 'author')); 


        return response()->json($book, 201); 
    }
}