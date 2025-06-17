import SortableTableHeader from '@/components/molecules/SortableTableHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Book } from '@/types';
import BookTableRow from './BookTableRow';

interface BookTableProps {
    books: Book[];
    isLoading: boolean;
    sortField: string;
    sortDirection: 'asc' | 'desc';
    onSort: (field: string) => void;
}

const BookTable = ({ books, isLoading, sortField, sortDirection, onSort }: BookTableProps) => {
    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                        <SortableTableHeader label="Title" field="title" {...{ sortField, sortDirection, onSort }} />
                        <SortableTableHeader label="Author" field="author" {...{ sortField, sortDirection, onSort }} />
                        <TableHead className="text-right font-semibold text-gray-900 dark:text-gray-100">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && (
                        <TableRow>
                            <TableCell colSpan={3} className="h-24 text-center">
                                Loading books...
                            </TableCell>
                        </TableRow>
                    )}
                    {!isLoading && books.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} className="h-24 text-center">
                                No books found. Try adding one!
                            </TableCell>
                        </TableRow>
                    )}
                    {!isLoading && books.map((book, index) => <BookTableRow key={book.id} book={book} index={index} />)}
                </TableBody>
            </Table>
        </div>
    );
};

export default BookTable;
