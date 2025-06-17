import { Head, usePage } from '@inertiajs/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

// Foundational
import { useDebounce } from '@/hooks/useDebounce';
import AppLayout from '@/layouts/app-layout';
import { addBook, exportBooks, fetchBooks } from '@/services/bookService';
import { Book, BreadcrumbItem, PageProps } from '@/types';

// Atoms & Molecules
import BookCardHeaderAtom from '@/components/atoms/BookCardHeaderAtom';
import BookHeaderAtom from '@/components/atoms/BookHeaderAtom';

// Organisms
import BookForm, { BookFormData } from '@/components/organisms/BookForm';
import BookListHeader from '@/components/organisms/BookListHeader';
import BookTable from '@/components/organisms/BookTable';
import { Card, CardContent } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Book Management', href: '/books' }];

const BooksPage = () => {
    const {
        books: initialBooks,
        search: initialSearch,
        sortField: initialSortField,
        sortDirection: initialSortDirection,
    } = usePage<PageProps>().props;

    const queryClient = useQueryClient();

    const [searchTerm, setSearchTerm] = useState(initialSearch || '');
    const [sortField, setSortField] = useState<string>(initialSortField || 'id');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection || 'asc');

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const { data: books = initialBooks, isLoading } = useQuery<Book[]>({
        queryKey: ['books', debouncedSearchTerm, sortField, sortDirection],
        queryFn: () => fetchBooks(debouncedSearchTerm, sortField, sortDirection),
    });

    const { mutate: addBookMutate, isPending: isAdding } = useMutation({
        mutationFn: addBook,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
        },
        onError: (error) => {
            console.error('Failed to add book:', error);
        },
    });

    const handleAddBook = (values: BookFormData, form: UseFormReturn<BookFormData>) => {
        addBookMutate(values, {
            onSuccess: () => {
                form.reset();
            },
        });
    };

    const handleSort = (field: string) => {
        setSortDirection((prev) => (sortField === field && prev === 'asc' ? 'desc' : 'asc'));
        setSortField(field);
    };

    const handleExport = (format: string, type: string) => {
        exportBooks(format, type, debouncedSearchTerm, sortField, sortDirection);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Book Management" />
            <div className="flex flex-col items-center gap-8 px-4 py-8">
                <BookHeaderAtom />

                <Card className="group w-full max-w-2xl bg-gradient-to-br from-blue-50 to-indigo-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:from-blue-900/20 dark:to-indigo-900/20">
                    <BookCardHeaderAtom />
                    <CardContent>
                        <BookForm onSubmit={handleAddBook} isPending={isAdding} />
                    </CardContent>
                </Card>

                <Card className="w-full max-w-6xl transition-all duration-300">
                    <BookListHeader
                        searchTerm={searchTerm}
                        onSearchChange={(e) => setSearchTerm(e.target.value)}
                        isDebouncing={debouncedSearchTerm !== searchTerm}
                        onExport={handleExport}
                    />
                    <BookTable books={books} isLoading={isLoading} sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                </Card>
            </div>
        </AppLayout>
    );
};

export default BooksPage;
