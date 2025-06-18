import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LucideCircleHelp } from 'lucide-react';
import { Control, FieldValues, Path } from 'react-hook-form';

interface FormFieldAtomProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder: string;
    tooltipText: string;
    isRequired?: boolean;
}

const FormFieldAtom = <T extends FieldValues>({ control, name, label, placeholder, tooltipText, isRequired = false }: FormFieldAtomProps<T>) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <TooltipProvider>
                    <Tooltip>
                        <FormLabel className="flex items-center text-gray-800 dark:text-gray-200">
                            {label} {isRequired && <span className="ml-1 text-red-600">*</span>}
                            <TooltipTrigger type="button" className="ml-1.5">
                                <LucideCircleHelp className="text-blue-600 dark:text-blue-400" size={13} />
                            </TooltipTrigger>
                        </FormLabel>
                        <TooltipContent>
                            <p>{tooltipText}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <FormControl>
                    <Input placeholder={placeholder} {...field} className="transition-all duration-200 focus:ring-2 focus:ring-blue-500" />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);

export default FormFieldAtom;
