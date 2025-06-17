import { BookOpen, Sparkles } from 'lucide-react';

const BookHeaderAtom = () => (
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
);

export default BookHeaderAtom;
