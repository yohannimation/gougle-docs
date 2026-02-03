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