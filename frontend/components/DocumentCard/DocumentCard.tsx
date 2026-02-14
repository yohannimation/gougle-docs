import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import DocumentPreviewCard from "@/components/DocumentPreviewCard/DocumentPreviewCard";
import { DeleteButton } from "@/components/DeleteButton/DeleteButton";

import type { DocumentCardInterface } from "@/interface/Document.interface";

import { PenLine, Trash } from "lucide-react"

interface DocumentCardProps {
    document: DocumentCardInterface,
    deleteDocument: (id: string) => void
}

export default function DocumentCard({document, deleteDocument}: DocumentCardProps) {
    const cardFooter = <>
        <DocumentPreviewCard id={document.id} name={document.name} deleteDocument={deleteDocument} />
        {
            document.isEditable && (
                <>
                    <Link href={`/docs/${document.id}`} target="_blank">
                        <Button className="w-full bg-amber-200 text-amber-700 hover:bg-amber-500 hover:text-white">
                            <PenLine /> Edit
                        </Button>
                    </Link>
                    <DeleteButton id={document.id} deleteDocument={deleteDocument} />
                </>
            )
        }
    </>
    
    return (
        <Card className="relative mx-auto w-full max-w-sm gap-3">
            <CardHeader>
                <CardTitle>{ document.name }</CardTitle>
            </CardHeader>
            <CardFooter className="grid grid-cols-3 gap-2">
                { cardFooter }
            </CardFooter>
        </Card>
    );
}