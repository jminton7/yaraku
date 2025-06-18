import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText } from 'lucide-react';

interface ExportDropdownProps {
    onExport: (format: string, type: string) => void;
}

const ExportDropdown = ({ onExport }: ExportDropdownProps) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" className="cursor-pointer gap-2">
                <Download className="h-4 w-4" />
                Export
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Export Format</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                    <FileText className="mr-2 h-4 w-4" />
                    CSV
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => onExport('csv', 'full')}>Title & Author</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onExport('csv', 'titles')}>Titles Only</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onExport('csv', 'authors')}>Authors Only</DropdownMenuItem>
                </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                    <FileText className="mr-2 h-4 w-4" />
                    XML
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => onExport('xml', 'full')}>Title & Author</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onExport('xml', 'titles')}>Titles Only</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onExport('xml', 'authors')}>Authors Only</DropdownMenuItem>
                </DropdownMenuSubContent>
            </DropdownMenuSub>
        </DropdownMenuContent>
    </DropdownMenu>
);

export default ExportDropdown;
