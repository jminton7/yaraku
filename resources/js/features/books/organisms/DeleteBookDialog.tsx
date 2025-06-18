import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { deleteBook } from '@/services/bookService';
import { Book } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Trash2 } from 'lucide-react';

interface DeleteBookDialogProps {
    book: Book;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const DeleteBookDialog = ({ book, isOpen, onOpenChange }: DeleteBookDialogProps) => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: deleteBook,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
            onOpenChange(false);
        },
        onError: (error) => {
            console.error('Error deleting book:', error);
        },
    });

    const handleDelete = () => {
        mutate(book.id);
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                            <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                    <AlertDialogTitle className="text-center">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        This action cannot be undone. This will permanently delete the book
                        <br />
                        <span className="font-semibold text-gray-800 dark:text-gray-200">"{book.title}"</span> by{' '}
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{book.author}</span>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-red-600 hover:bg-red-700">
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isPending ? 'Deleting...' : 'Yes, delete it'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteBookDialog;
