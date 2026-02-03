import {
    Card,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import type { DocumentCardInterface } from "../../interface/Document.interface";

interface DocumentCardProps {
    document: DocumentCardInterface
}

import { Eye, PenLine, Trash } from "lucide-react"

export default function DocumentCard({document}: DocumentCardProps) {
    return (
        <Card className="relative mx-auto w-full max-w-sm gap-3">
            <CardHeader>
                <CardTitle>{document.name}</CardTitle>
            </CardHeader>
            <CardFooter className="grid grid-cols-3 gap-2">
                <Button size="icon" variant="secondary" className="w-full">
                    <Eye /> Preview
                </Button>
                {
                    document.isEditable && (
                        <>
                            <Button size="icon" variant="secondary" className="w-full bg-orange-300 text-orange-800 hover:bg-orange-300 hover:text-orange-800">
                                <PenLine /> Edit
                            </Button>
                            <Button size="icon" variant="destructive" className="w-full">
                                <Trash /> Delete
                            </Button>
                        </>
                    )
                }
                
            </CardFooter>
        </Card>
    );
}