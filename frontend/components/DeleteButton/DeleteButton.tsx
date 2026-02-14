import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTitle,
    PopoverTrigger,
} from '@/components/ui/popover';

import { CircleAlert, Trash } from 'lucide-react';

interface DeleteButtonProps {
    id: string;
    deleteDocument: (id: string) => void;
}

export default function DeleteButton({
    id,
    deleteDocument,
}: DeleteButtonProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="destructive" className="w-full">
                    <Trash /> Delete
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="flex flex-col gap-3">
                <PopoverTitle>
                    Are you sure you want to delete this document ?
                </PopoverTitle>
                <Button
                    variant="destructive"
                    className="font-semibold"
                    onClick={(e) => deleteDocument(id)}
                >
                    <CircleAlert /> Permanently delete
                </Button>
            </PopoverContent>
        </Popover>
    );
}
