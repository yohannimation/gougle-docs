import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover"

import { CircleAlert, Trash } from "lucide-react"

interface DeleteButtonProps {
    id: string,
    deleteDocument: (id: string) => void
}

export function DeleteButton({id, deleteDocument}: DeleteButtonProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
            <Button
                className="w-full bg-red-200 text-red-700 hover:bg-red-500 hover:text-white"
            >
                <Trash /> Delete
            </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="flex flex-col gap-3">
                <PopoverTitle>Are you sure you want to delete this document ?</PopoverTitle>
                <Button
                    className="w-full bg-red-200 text-red-700 hover:bg-red-500 hover:text-white font-semibold"
                    onClick={(e) => deleteDocument(id)}
                >
                    <CircleAlert /> Permanently delete
                </Button>
            </PopoverContent>
        </Popover>
    )
}
