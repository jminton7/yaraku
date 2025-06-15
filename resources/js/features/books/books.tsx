import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, usePage } from '@inertiajs/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ArrowDown, ArrowUp, BookOpen, Download, Edit, FileText, LucideCircleHelp, Plus, Search, Sparkles, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
    title: z.string().min(2, {
        message: 'Title must be at least 2 characters.',
    }),
    author: z.string().min(2, {
        message: 'Author must be at least 2 characters.',
    }),
});

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Book Management',
        href: '/books',
    },
];

interface Book {
    id: number;
    title: string;
    author: string;
}

interface PageProps {
    books: Book[];
    search: string;
    sortField: string;
    sortDirection: 'asc' | 'desc';
    [key: string]: unknown;
}

// Debounce the search term to avoid excessive API calls
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const Books = () => {
    const {
        books: initialBooks,
        search: initialSearch,
        sortField: initialSortField,
        sortDirection: initialSortDirection,
    } = usePage<PageProps>().props;
    const queryClient = useQueryClient();
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(initialSearch || '');
    const [sortField, setSortField] = useState<string>(initialSortField || 'id');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection || 'asc');

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            author: '',
        },
    });

    const editForm = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            author: '',
        },
    });

    const fetchBooks = useCallback(async () => {
        const response = await axios.get<Book[]>('/books', {
            params: { search: debouncedSearchTerm, sortField, sortDirection },
        });
        return response.data;
    }, [debouncedSearchTerm, sortField, sortDirection]);

    const { data: books = initialBooks, isLoading } = useQuery<Book[]>({
        queryKey: ['books', debouncedSearchTerm, sortField, sortDirection],
        queryFn: fetchBooks,
        initialData: initialBooks,
        staleTime: 0, // Always refetch when query key changes
    });

    const addBookMutation = useMutation({
        mutationFn: async (bookData: z.infer<typeof formSchema>) => {
            const response = await axios.post<Book>('/books', bookData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books', debouncedSearchTerm, sortField, sortDirection] });
            form.reset();
        },
        onError: (error) => {
            console.error('Error adding book:', error);
        },
    });

    const updateBookMutation = useMutation({
        mutationFn: async ({ id, bookData }: { id: number; bookData: z.infer<typeof formSchema> }) => {
            const response = await axios.put<Book>(`/books/${id}`, bookData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books', debouncedSearchTerm, sortField, sortDirection] });
            setIsEditSheetOpen(false);
            setEditingBook(null);
            editForm.reset();
        },
        onError: (error) => {
            console.error('Error updating book:', error);
        },
    });

    const deleteBookMutation = useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`/books/${id}`);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books', debouncedSearchTerm, sortField, sortDirection] });
        },
        onError: (error) => {
            console.error('Error deleting book:', error);
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        addBookMutation.mutate(values);
    };

    const onEditSubmit = (values: z.infer<typeof formSchema>) => {
        if (editingBook) {
            updateBookMutation.mutate({ id: editingBook.id, bookData: values });
        }
    };

    const handleEditClick = (book: Book) => {
        setEditingBook(book);
        editForm.setValue('title', book.title);
        editForm.setValue('author', book.author);
        setIsEditSheetOpen(true);
    };

    const handleDeleteClick = (bookId: number) => {
        deleteBookMutation.mutate(bookId);
    };

    const handleEditSheetClose = () => {
        setIsEditSheetOpen(false);
        setEditingBook(null);
        editForm.reset();
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleExport = (format: string, type: string) => {
        const params = new URLSearchParams({
            format: format,
            type: type,
            search: debouncedSearchTerm || '',
            sortField: sortField,
            sortDirection: sortDirection,
        });

        window.open(`/books/export?${params.toString()}`, '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Book Management" />
            <div className="flex flex-col items-center gap-8 px-4">
                <div className="mb-2 text-center">
                    <div className="mb-4 flex items-center justify-center">
                        <div className="mr-4 rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                            <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Manage Your Books</h1>
                        <div className="ml-4 rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
                            <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                        Add new books to your collection and manage your existing library with ease.
                    </p>
                </div>

                <Card className="group w-full max-w-2xl bg-gradient-to-br from-blue-50 to-indigo-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:from-blue-900/20 dark:to-indigo-900/20">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">Add New Book</CardTitle>
                        <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                            Enter the details of your book below to add it to your collection
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Tooltip>
                                                <FormLabel className="text-gray-800 dark:text-gray-200">
                                                    Title <span className="text-red-600">*</span>
                                                    <TooltipTrigger type="button">
                                                        <LucideCircleHelp className="ml-1 text-blue-600 dark:text-blue-400" size={13} />
                                                    </TooltipTrigger>
                                                </FormLabel>
                                                <TooltipContent>
                                                    <p>This is the title of your book.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <FormControl>
                                                <Input
                                                    placeholder="The Lord Of The Rings"
                                                    {...field}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="author"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Tooltip>
                                                <FormLabel className="text-gray-800 dark:text-gray-200">
                                                    Author <span className="text-red-600">*</span>
                                                    <TooltipTrigger type="button">
                                                        <LucideCircleHelp className="ml-1 text-blue-600 dark:text-blue-400" size={13} />
                                                    </TooltipTrigger>
                                                </FormLabel>
                                                <TooltipContent>
                                                    <p>This is the author of your book.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <FormControl>
                                                <Input
                                                    placeholder="J.R.R. Tolkien"
                                                    {...field}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-center pt-4">
                                    <Button
                                        type="submit"
                                        className="bg-blue-600 px-8 py-2 text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg disabled:opacity-50"
                                        disabled={addBookMutation.isPending}
                                    >
                                        {addBookMutation.isPending ? (
                                            <>
                                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Book
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <Card className="w-full max-w-6xl transition-all duration-300 hover:shadow-lg">
                    <CardContent>
                        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="relative mx-auto max-w-md md:mx-0">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    placeholder="Search books by title or author"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                                />
                                {debouncedSearchTerm !== searchTerm && (
                                    <div className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2">
                                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
                                    </div>
                                )}
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-2">
                                        <Download className="h-4 w-4" />
                                        Export
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <FileText className="mr-2 h-4 w-4" />
                                            CSV
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem onClick={() => handleExport('csv', 'full')}>Title & Author</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleExport('csv', 'titles')}>Titles Only</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleExport('csv', 'authors')}>Authors Only</DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <FileText className="mr-2 h-4 w-4" />
                                            XML
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem onClick={() => handleExport('xml', 'full')}>Title & Author</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleExport('xml', 'titles')}>Titles Only</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleExport('xml', 'authors')}>Authors Only</DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                                        <TableHead
                                            className="cursor-pointer font-semibold text-gray-900 transition-colors hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700/50"
                                            onClick={() => handleSort('title')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Title
                                                {sortField === 'title' && (sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />)}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer font-semibold text-gray-900 transition-colors hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700/50"
                                            onClick={() => handleSort('author')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Author
                                                {sortField === 'author' &&
                                                    (sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />)}
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-right font-semibold text-gray-900 dark:text-gray-100">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {books.length > 0 && !isLoading ? (
                                        books.map((book, index) => (
                                            <TableRow
                                                key={book.id}
                                                className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                                style={{ animationDelay: `${index * 0.1}s` }}
                                            >
                                                <TableCell className="font-medium text-gray-900 dark:text-gray-100">{book.title}</TableCell>
                                                <TableCell className="text-gray-700 dark:text-gray-300">{book.author}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Sheet
                                                            open={isEditSheetOpen && editingBook?.id === book.id}
                                                            onOpenChange={(open) => {
                                                                if (!open) handleEditSheetClose();
                                                            }}
                                                        >
                                                            <SheetTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                                                    onClick={() => handleEditClick(book)}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                    <span className="sr-only">Edit</span>
                                                                </Button>
                                                            </SheetTrigger>
                                                            <SheetContent className="w-full max-w-md">
                                                                <SheetHeader>
                                                                    <div className="mb-4 flex items-center justify-center">
                                                                        <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                                                            <Edit className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                                        </div>
                                                                    </div>
                                                                    <SheetTitle className="text-center text-xl">Edit Book</SheetTitle>
                                                                    <SheetDescription className="text-center">
                                                                        Make changes to your book here. Click save when you're done.
                                                                    </SheetDescription>
                                                                </SheetHeader>
                                                                <div className="grid flex-1 auto-rows-min gap-6 py-6">
                                                                    <Form {...editForm}>
                                                                        <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
                                                                            <FormField
                                                                                control={editForm.control}
                                                                                name="title"
                                                                                render={({ field }) => (
                                                                                    <FormItem>
                                                                                        <FormLabel className="text-gray-800 dark:text-gray-200">
                                                                                            Title
                                                                                        </FormLabel>
                                                                                        <FormControl>
                                                                                            <Input
                                                                                                {...field}
                                                                                                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                                                                                            />
                                                                                        </FormControl>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                )}
                                                                            />
                                                                            <FormField
                                                                                control={editForm.control}
                                                                                name="author"
                                                                                render={({ field }) => (
                                                                                    <FormItem>
                                                                                        <FormLabel className="text-gray-800 dark:text-gray-200">
                                                                                            Author
                                                                                        </FormLabel>
                                                                                        <FormControl>
                                                                                            <Input
                                                                                                {...field}
                                                                                                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                                                                                            />
                                                                                        </FormControl>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                )}
                                                                            />
                                                                        </form>
                                                                    </Form>
                                                                </div>
                                                                <SheetFooter className="gap-2">
                                                                    <Button
                                                                        type="button"
                                                                        onClick={editForm.handleSubmit(onEditSubmit)}
                                                                        disabled={updateBookMutation.isPending}
                                                                        className="bg-blue-600 text-white hover:bg-blue-700"
                                                                    >
                                                                        {updateBookMutation.isPending ? (
                                                                            <>
                                                                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                                                Saving...
                                                                            </>
                                                                        ) : (
                                                                            'Save changes'
                                                                        )}
                                                                    </Button>
                                                                    <SheetClose asChild>
                                                                        <Button variant="outline" onClick={handleEditSheetClose}>
                                                                            Cancel
                                                                        </Button>
                                                                    </SheetClose>
                                                                </SheetFooter>
                                                            </SheetContent>
                                                        </Sheet>

                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                                                                    disabled={deleteBookMutation.isPending}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                    <span className="sr-only">Delete</span>
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <div className="mb-4 flex justify-center">
                                                                        <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                                                                            <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                                                                        </div>
                                                                    </div>
                                                                    <AlertDialogTitle className="text-center">Delete Book</AlertDialogTitle>
                                                                    <AlertDialogDescription className="text-center">
                                                                        Are you sure you want to delete "{book.title}" by {book.author}? This action
                                                                        cannot be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDeleteClick(book.id)}
                                                                        className="bg-red-600 text-white hover:bg-red-700"
                                                                    >
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="py-12 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-4">
                                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
                                                    <p className="text-gray-500 dark:text-gray-400">Searching...</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="py-12 text-center text-gray-500 dark:text-gray-400">
                                                No books found. Try adjusting your search or add a new book!
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default Books;
