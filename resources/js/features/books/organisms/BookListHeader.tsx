import ExportDropdown from '@/features/books/molecules/ExportDropdown';
import SearchInput from '@/features/books/molecules/SearchInput';

interface BookListHeaderProps {
    searchTerm: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isDebouncing: boolean;
    onExport: (format: string, type: string) => void;
}

const BookListHeader = ({ searchTerm, onSearchChange, isDebouncing, onExport }: BookListHeaderProps) => (
    <div className="flex w-full flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <SearchInput value={searchTerm} onChange={onSearchChange} isDebouncing={isDebouncing} />
        <ExportDropdown onExport={onExport} />
    </div>
);

export default BookListHeader;
