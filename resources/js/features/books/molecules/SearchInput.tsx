import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isDebouncing: boolean;
}

const SearchInput = ({ value, onChange, isDebouncing }: SearchInputProps) => (
    <div className="relative mx-auto max-w-md md:mx-0">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
            placeholder="Search books by title or author"
            value={value}
            onChange={onChange}
            className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
        />
        {isDebouncing && (
            <div className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
            </div>
        )}
    </div>
);

export default SearchInput;
