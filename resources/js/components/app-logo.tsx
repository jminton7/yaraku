import { BookOpen } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <BookOpen />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">Yaraku Books</span>
            </div>
        </>
    );
}
