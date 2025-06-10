import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, usePage } from '@inertiajs/react';
import { LucideCircleHelp } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

//TODO no special characters allowed in title and author
//And no blanks
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
}

interface PageProps {
    books: Book[];
}

const Books = () => {
    const { books } = usePage().props as PageProps;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            author: '',
        },
    });

    const onSubmit = () => {
        console.log('Submitting');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add New Book" />
            <div className="flex justify-center">
                <Card className="w-1/2">
                    <CardHeader>
                        <CardTitle>Add New Book</CardTitle>
                        <CardDescription>Enter the details of your book below</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {books.length > 0 && (
                            <div className="mb-4">
                                <h2 className="mb-2 text-lg font-semibold">Existing Books</h2>
                                <ul className="list-disc pl-5">
                                    {books.map((book) => (
                                        <li key={book.id}>{book.title}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Tooltip>
                                                <FormLabel>
                                                    Title *
                                                    <TooltipTrigger type="button">
                                                        <LucideCircleHelp className="ml-1" size={13} />
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
                                                    Author *
                                                    <TooltipTrigger type="button">
                                                        <LucideCircleHelp className="ml-1" size={13} />
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
                                <Button type="submit" className="w-max-sm hover:bg-sky-700">
                                    Add
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default Books;
