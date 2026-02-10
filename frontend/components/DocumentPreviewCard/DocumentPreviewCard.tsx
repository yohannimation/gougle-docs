import Link from "next/link"
import { useDocument } from "@/hooks/useDocument";

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"

import { Eye, PenLine, Trash } from "lucide-react"

interface DocumentPreviewProps {
    id: string,
    name: string,
    deleteDocument: (id: string) => void
}

export default function DocumentPreviewCard({id, name, deleteDocument}: DocumentPreviewProps) {
    const { document, isLoading, error, fetchDocument } = useDocument(id)

    const dialogContent = <>
        <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
        </DialogHeader>

        {
            !isLoading && document ? (
                <div className="no-scrollbar h-[80dvh] overflow-y-auto">
                    { document.content }
                </div>
            ) : (
                <Spinner className="m-auto mt-20 size-8" />
            )
        }
                
        <DialogFooter className="grid grid-cols-2 gap-2">
            {
                (!isLoading && document && document.isEditable) && (
                    <>
                        <Link href={`/docs/${document.id}`} target="_blank">
                            <Button className="w-full bg-amber-200 text-amber-700 hover:bg-amber-500 hover:text-white">
                                <PenLine /> Edit
                            </Button>
                        </Link>
                        <Button
                            className="w-full bg-red-200 text-red-700 hover:bg-red-500 hover:text-white"
                            onClick={(e) => deleteDocument(document.id)}
                        >
                            <Trash /> Delete
                        </Button>
                    </>
                )
            }
        </DialogFooter>
    </>
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className="w-full bg-slate-200 text-slate-700 hover:bg-slate-500 hover:text-white"
                    onClick={(e) => fetchDocument()}
                >
                    <Eye /> Preview
                </Button>
            </DialogTrigger>
            <DialogContent>
                { dialogContent }
            </DialogContent>
        </Dialog>
    );
}