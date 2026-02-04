import Link from "next/link"
import { JSX, useState } from "react";

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
    id: string
    name: string
    isEditable: boolean
}

export default function DocumentPreviewCard({id, name, isEditable}: DocumentPreviewProps) {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [content, setContent] = useState<JSX.Element[]|null>(null)

    const searchContent = (id: string) => {
        // Search content if no content are set
        if (!content) {
            console.log(id)
            setTimeout(() => {
                setIsLoading(false)
            }, 2000)

            const temp: JSX.Element[] = Array.from({ length: 10 }).map((_, index) => (
                <p key={index} className="mb-4 leading-normal">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                    enim ad minim veniam, quis nostrud exercitation ullamco laboris
                    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat
                    nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                    sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            ))
            setContent(temp)
        }
    }
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full bg-slate-200 text-slate-700 hover:bg-slate-500 hover:text-white" onClick={(e) => searchContent(id)}>
                    <Eye /> Preview
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{name}</DialogTitle>
                </DialogHeader>
                <div className="no-scrollbar h-[80dvh] overflow-y-auto">
                    {
                        !isLoading ? (
                                <>{content}</>
                            ) : (
                                <Spinner className="m-auto mt-20 size-8" />
                            )
                    }
                </div>
                
                <DialogFooter className="grid grid-cols-2 gap-2">
                    {
                        (!isLoading && isEditable) && (
                            <>
                                <Link href={`/docs/${id}`} target="_blank">
                                    <Button className="w-full bg-amber-200 text-amber-700 hover:bg-amber-500 hover:text-white">
                                        <PenLine /> Edit
                                    </Button>
                                </Link>
                                <Button className="w-full bg-red-200 text-red-700 hover:bg-red-500 hover:text-white">
                                    <Trash /> Delete
                                </Button>
                            </>
                        )
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}