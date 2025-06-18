import { TableHead } from '@/components/ui/table';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface SortableTableHeaderProps {
    label: string;
    field: string;
    sortField: string;
    sortDirection: 'asc' | 'desc';
    onSort: (field: string) => void;
}

const SortableTableHeader = ({ label, field, sortField, sortDirection, onSort }: SortableTableHeaderProps) => (
    <TableHead
        className="cursor-pointer font-semibold text-gray-900 transition-colors hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700/50"
        onClick={() => onSort(field)}
    >
        <div className="flex items-center gap-1">
            {label}
            {sortField === field && (sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />)}
        </div>
    </TableHead>
);

export default SortableTableHeader;
