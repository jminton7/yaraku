import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { updateBook } from '@/services/bookService';
import { Book } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit } from 'lucide-react';
import BookForm, { BookFormData } from './BookForm';

interface EditBookSheetProps {
    book: Book;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const EditBookSheet = ({ book, isOpen, onOpenChange }: EditBookSheetProps) => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: (data: BookFormData) => updateBook(book.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
            onOpenChange(false);
        },
        onError: (error) => {
            console.error('Error updating book:', error);
        },
    });

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-full max-w-md">
                <SheetHeader>
                    <div className="mb-4 flex items-center justify-center">
                        <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                            <Edit className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <SheetTitle className="text-center text-xl">Edit Book</SheetTitle>
                    <SheetDescription className="text-center">Make changes to your book here. Click save when you're done.</SheetDescription>
                </SheetHeader>
                <div className="py-6">
                    <BookForm
                        onSubmit={(values) => mutate(values)}
                        isPending={isPending}
                        defaultValues={book}
                        submitText="Save Changes"
                        pendingText="Saving..."
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default EditBookSheet;
