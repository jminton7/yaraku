<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Book;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::query();
        
        if ($request->has('search') && $request->search !== '') {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('author', 'LIKE', "%{$searchTerm}%");
            });
        }
        
        $books = $query->get();
        
        if ($request->expectsJson()) {
            return response()->json($books);
        }
        
        return Inertia::render('books/index', [
            'books' => $books,
            'search' => $request->search ?? ''
        ]);
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
    
    public function update(Request $request, Book $book)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
        ]);
       
        $book->update($request->only('title', 'author'));
       
        return response()->json($book);
    }
    
    public function destroy(Book $book)
    {
        $book->delete();
        
        return response()->json(['message' => 'Book deleted successfully']);
    }
}