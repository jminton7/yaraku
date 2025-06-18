import { CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';

const BookCardHeader = () => (
    <CardHeader className="text-center">
        <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">Add New Book</CardTitle>
        <CardDescription className="text-base text-gray-600 dark:text-gray-400">
            Enter the details of your book below to add it to your collection
        </CardDescription>
    </CardHeader>
);

export default BookCardHeader;
