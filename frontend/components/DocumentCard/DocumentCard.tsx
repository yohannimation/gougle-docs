import { Button } from "@/components/ui/button"
import {
    Card,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import DocumentPreviewCard from "../DocumentPreviewCard/DocumentPreviewCard";

import type { DocumentCardInterface } from "../../interface/Document.interface";

import { PenLine, Trash } from "lucide-react"

interface DocumentCardProps {
    document: DocumentCardInterface
}

export default function DocumentCard({document}: DocumentCardProps) {
    return (
        <Card className="relative mx-auto w-full max-w-sm gap-3">
            <CardHeader>
                <CardTitle>{document.name}</CardTitle>
            </CardHeader>
            <CardFooter className="grid grid-cols-3 gap-2">
                <DocumentPreviewCard id={document.id} name={document.name} />
                {
                    document.isEditable && (
                        <>
                            <Button className="w-full bg-amber-200 text-amber-700 hover:bg-amber-500 hover:text-white">
                                <PenLine /> Edit
                            </Button>
                            <Button className="w-full bg-red-200 text-red-700 hover:bg-red-500 hover:text-white">
                                <Trash /> Delete
                            </Button>
                        </>
                    )
                }
                
            </CardFooter>
        </Card>
    );
}