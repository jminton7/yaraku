import { formSchema } from '@/components/organisms/BookForm'; 
import { Book } from '@/types';
import axios from 'axios';
import { z } from 'zod';

type SortDirection = 'asc' | 'desc';

// Fetch books with sorting and searching
export const fetchBooks = async (search: string, sortField: string, sortDirection: SortDirection): Promise<Book[]> => {
    const response = await axios.get<Book[]>('/books', {
        params: { search, sortField, sortDirection },
    });
    return response.data;
};

// Add a new book
export const addBook = async (bookData: z.infer<typeof formSchema>): Promise<Book> => {
    const response = await axios.post<Book>('/books', bookData);
    return response.data;
};

// Update an existing book
export const updateBook = async (id: number, bookData: z.infer<typeof formSchema>): Promise<Book> => {
    const response = await axios.put<Book>(`/books/${id}`, bookData);
    return response.data;
};

// Delete a book
export const deleteBook = async (id: number): Promise<number> => {
    await axios.delete(`/books/${id}`);
    return id;
};

// Handle file exports
export const exportBooks = (format: string, type: string, search: string, sortField: string, sortDirection: SortDirection): void => {
    const params = new URLSearchParams({
        format,
        type,
        search: search || '',
        sortField,
        sortDirection,
    });
    window.open(`/books/export?${params.toString()}`, '_blank');
};
