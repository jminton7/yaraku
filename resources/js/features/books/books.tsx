import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, usePage } from '@inertiajs/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Edit, LucideCircleHelp, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

//TODO no special characters allowed in title and author
//And no blanks
//and max 255
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

interface PageProps extends InertiaPageProps {
    books: Book[];
}

const Books = () => {
    const { books: initialBooks } = usePage<PageProps>().props;
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            author: '',
        },
    });

    const { data: books = initialBooks, isLoading } = useQuery<Book[]>({
        queryKey: ['books'],
        queryFn: async () => {
            const response = await axios.get<Book[]>('/books');
            return response.data;
        },
        initialData: initialBooks,
    });

    const addBookMutation = useMutation({
        mutationFn: async (bookData: z.infer<typeof formSchema>) => {
            const response = await axios.post<Book>('/books', bookData);
            return response.data;
        },
        onSuccess: (newBook) => {
            queryClient.setQueryData<Book[]>(['books'], (oldBooks) => {
                return [...(oldBooks || []), newBook];
            });
            form.reset();
            console.log('Book added successfully!');
        },
        onError: (error) => {
            console.error('Error adding book:', error);
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        addBookMutation.mutate(values);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add New Book" />
            <div className="flex flex-col items-center gap-6">
                <Card className="w-1/2">
                    <CardHeader>
                        <CardTitle>Add New Book</CardTitle>
                        <CardDescription>Enter the details of your book below</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Tooltip>
                                                <FormLabel>
                                                    Title <span className="text-red-700">*</span>
                                                    <TooltipTrigger type="button">
                                                        <LucideCircleHelp className="ml-1 text-blue-600" size={13} />
                                                    </TooltipTrigger>
                                                </FormLabel>
                                                <TooltipContent>
                                                    <p>This is the title of your book.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <FormControl>
                                                <Input placeholder="The Lord Of The Rings" {...field} />
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
                                                <FormLabel>
                                                    Author <span className="text-red-700">*</span>
                                                    <TooltipTrigger type="button">
                                                        <LucideCircleHelp className="ml-1 text-blue-600" size={13} />
                                                    </TooltipTrigger>
                                                </FormLabel>
                                                <TooltipContent>
                                                    <p>This is the author of your book.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <FormControl>
                                                <Input placeholder="J.R.R. Tolkien" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700"></hr>
                                <Button type="submit" className="w-max-sm hover:bg-sky-700" disabled={addBookMutation.isPending}>
                                    {addBookMutation.isPending ? 'Adding...' : 'Add'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <Card className="w-3/4">
                    <CardHeader>
                        <CardTitle>Existing Books</CardTitle>
                        <CardDescription>Manage your book collection</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="">Title</TableHead>
                                    <TableHead className="">Author</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {books.length > 0 && !isLoading ? (
                                    books.map((book) => (
                                        <TableRow key={book.id}>
                                            <TableCell className="font-medium">{book.title}</TableCell>
                                            <TableCell className="">{book.author}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <Edit className="h-4 w-4" />
                                                        <span className="sr-only">Edit</span>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">Delete</span>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                                            No books found. Add your first book above!
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default Books;
