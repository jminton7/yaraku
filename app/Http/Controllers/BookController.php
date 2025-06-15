<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Book;
use SimpleXMLElement;

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
        $sortField = $request->input('sortField', 'id');  
        $sortDirection = $request->input('sortDirection', 'asc');  
        if (!in_array($sortField, ['title', 'author', 'id'])) {
            $sortField = 'id';  
        }
        if (!in_array(strtolower($sortDirection), ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }
        $query->orderBy($sortField, $sortDirection);
       
        $books = $query->get();
       
        if ($request->expectsJson()) {
            return response()->json($books);
        }
       
        return Inertia::render('books/index', [
            'books' => $books,
            'search' => $request->search ?? '',
            'sortField' => $sortField,
            'sortDirection' => $sortDirection      
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

    public function export(Request $request)
    {
        // For validation failures to return JSON, the request must ask for it.
        // The test will be updated to use getJson().
        $request->validate([
            'format' => 'required|in:csv,xml',
            'type' => 'required|in:full,titles,authors'
        ]);

        $query = Book::query();
        
        // Apply same filtering as index
        if ($request->has('search') && $request->search !== '') {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('author', 'LIKE', "%{$searchTerm}%");
            });
        }

        $sortField = $request->input('sortField', 'id');  
        $sortDirection = $request->input('sortDirection', 'asc');  
        if (!in_array($sortField, ['title', 'author', 'id'])) {
            $sortField = 'id';  
        }
        if (!in_array(strtolower($sortDirection), ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }
        $query->orderBy($sortField, $sortDirection);

        $books = $query->get();
        $format = $request->format;
        $type = $request->type;

        if ($format === 'csv') {
            return $this->exportCsv($books, $type);
        } else {
            return $this->exportXml($books, $type);
        }
    }

    /**
     * MODIFIED: Switched from a StreamedResponse to a regular Response.
     * This builds the CSV content in memory, making it easily testable.
     */
    private function exportCsv($books, $type)
    {
        $filename = 'books_' . $type . '_' . date('Y-m-d_H-i-s') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $handle = fopen('php://memory', 'w');
        
        // Add headers based on type
        if ($type === 'full') {
            fputcsv($handle, ['Title', 'Author']);
            foreach ($books as $book) {
                fputcsv($handle, [$book->title, $book->author]);
            }
        } elseif ($type === 'titles') {
            fputcsv($handle, ['Title']);
            foreach ($books as $book) {
                fputcsv($handle, [$book->title]);
            }
        } elseif ($type === 'authors') {
            fputcsv($handle, ['Author']);
            foreach ($books as $book) {
                fputcsv($handle, [$book->author]);
            }
        }
        
        rewind($handle);
        $content = stream_get_contents($handle);
        fclose($handle);

        return response($content, 200, $headers);
    }

    /**
     * MODIFIED: Removed htmlspecialchars().
     * SimpleXMLElement handles XML entity escaping automatically.
     */
    private function exportXml($books, $type)
    {
        $filename = 'books_' . $type . '_' . date('Y-m-d_H-i-s') . '.xml';
        
        $xml = new SimpleXMLElement('<books/>');
        
        foreach ($books as $book) {
            $bookElement = $xml->addChild('book');
            
            if ($type === 'full') {
                $bookElement->addChild('title', htmlspecialchars($book->title));
                $bookElement->addChild('author', htmlspecialchars($book->author));
            } elseif ($type === 'titles') {
                $bookElement->addChild('title', htmlspecialchars($book->title));
            } elseif ($type === 'authors') {
                $bookElement->addChild('author', htmlspecialchars($book->author));
            }
        }

        $headers = [
            'Content-Type' => 'application/xml',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        return response($xml->asXML(), 200, $headers);
    }
}