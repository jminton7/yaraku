import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import FormFieldAtom from '@/features/books/atoms/FormField';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus } from 'lucide-react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

export const formSchema = z.object({
    title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
    author: z.string().min(2, { message: 'Author must be at least 2 characters.' }),
});

export type BookFormData = z.infer<typeof formSchema>;

interface BookFormProps {
    onSubmit: (values: BookFormData, form: UseFormReturn<BookFormData>) => void;
    isPending: boolean;
    defaultValues?: Partial<BookFormData>;
    submitText?: string;
    pendingText?: string;
}

const BookForm = ({
    onSubmit,
    isPending,
    defaultValues = { title: '', author: '' },
    submitText = 'Add Book',
    pendingText = 'Adding...',
}: BookFormProps) => {
    const form = useForm<BookFormData>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const handleFormSubmit = (values: BookFormData) => {
        onSubmit(values, form);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                <FormFieldAtom
                    control={form.control}
                    name="title"
                    label="Title"
                    placeholder="The Lord Of The Rings"
                    tooltipText="This is the title of your book."
                    isRequired
                />
                <FormFieldAtom
                    control={form.control}
                    name="author"
                    label="Author"
                    placeholder="J.R.R. Tolkien"
                    tooltipText="This is the author of your book."
                    isRequired
                />
                <div className="flex justify-center pt-4">
                    <Button
                        type="submit"
                        className="w-40 cursor-pointer bg-blue-600 text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg disabled:opacity-50"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {pendingText}
                            </>
                        ) : (
                            <>
                                <Plus className="mr-2 h-4 w-4" />
                                {submitText}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default BookForm;
