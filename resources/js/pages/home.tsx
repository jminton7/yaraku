import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Library, Plus, Sparkles } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: '/dashboard',
    },
];

export default function Home() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />
            <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
                <div className="mb-12 text-center">
                    <div className="mb-4 flex items-center justify-center">
                        <div className="mr-4 rounded-full bg-blue-100 p-3">
                            <BookOpen className="h-8 w-8 text-blue-600" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Welcome to Yaraku Books!</h1>
                        <div className="ml-4 rounded-full bg-purple-100 p-3">
                            <Sparkles className="h-8 w-8 text-purple-600" />
                        </div>
                    </div>
                    <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-400">
                        Your personal digital library awaits. Organize, manage, and discover your favorite books in one beautiful place.
                    </p>
                </div>

                <div className="w-full max-w-6xl">
                    <h2 className="mb-8 text-center text-2xl font-semibold text-gray-800 dark:text-gray-200">What You Can Do</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="rounded-lg bg-blue-50 p-6 text-center dark:bg-blue-900/20">
                            <div className="mx-auto mb-4 w-fit rounded-full bg-blue-200 p-3 dark:bg-blue-800">
                                <Plus className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">Add Books</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Quickly add new books to your collection with title and author information
                            </p>
                        </div>

                        <div className="rounded-lg bg-purple-50 p-6 text-center dark:bg-purple-900/20">
                            <div className="mx-auto mb-4 w-fit rounded-full bg-purple-200 p-3 dark:bg-purple-800">
                                <BookOpen className="h-6 w-6 text-purple-700 dark:text-purple-300" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">Edit Details</h3>
                            <p className="text-gray-600 dark:text-gray-400">Update book information and keep your library accurate and organized</p>
                        </div>

                        <div className="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/20">
                            <div className="mx-auto mb-4 w-fit rounded-full bg-red-200 p-3 dark:bg-red-800">
                                <Library className="h-6 w-6 text-red-700 dark:text-red-300" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">Manage Collection</h3>
                            <p className="text-gray-600 dark:text-gray-400">View, search, and organize your entire book collection in one place</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="mb-4 text-gray-600 dark:text-gray-400">Ready to organize your reading collection?</p>
                    <Link href="/books">
                        <Button size="lg" className="bg-blue-600 px-8 py-3 text-lg text-white hover:bg-blue-700">
                            Start Managing Books
                        </Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
