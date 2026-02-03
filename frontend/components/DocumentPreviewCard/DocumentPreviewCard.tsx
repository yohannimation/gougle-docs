import { JSX, useState } from "react";

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"

import { Eye } from "lucide-react"

interface DocumentPreviewProps {
    id: string
    name: string
}

export default function DocumentPreviewCard({id, name}: DocumentPreviewProps) {
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
                <Button size="icon" variant="secondary" className="w-full" onClick={(e) => searchContent(id)}>
                    <Eye /> Preview
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-none">
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
            </DialogContent>
        </Dialog>
    );
}