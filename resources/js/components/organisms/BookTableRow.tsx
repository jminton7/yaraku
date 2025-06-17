import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Book } from '@/types';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import DeleteBookDialog from './DeleteBookDialog';
import EditBookSheet from './EditBookSheet';

interface BookTableRowProps {
    book: Book;
    index: number;
}

const BookTableRow = ({ book, index }: BookTableRowProps) => {
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    return (
        <>
            <TableRow
                className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
            >
                <TableCell className="font-medium text-gray-900 dark:text-gray-100">{book.title}</TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">{book.author}</TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                            onClick={() => setIsEditSheetOpen(true)}
                        >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                            onClick={() => setIsDeleteDialogOpen(true)}
                        >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
            <EditBookSheet book={book} isOpen={isEditSheetOpen} onOpenChange={setIsEditSheetOpen} />
            <DeleteBookDialog book={book} isOpen={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} />
        </>
    );
};

export default BookTableRow;
