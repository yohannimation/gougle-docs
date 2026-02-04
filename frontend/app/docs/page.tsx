'use client'
import { useEffect, useState } from "react";

import DocumentCardList from "@/components/DocumentCardList/DocumentCardList";

import type { DocumentCardListInterface } from "../../interface/Document.interface";

export default function Docs() {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const documents: DocumentCardListInterface = [
        {
            id: "0",
            name: "document test",
            isEditable: true
        }
    ]

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 500)
    }, [])

    return (<>
        <h1>Docs</h1>
        <DocumentCardList documents={documents} isLoading={isLoading} />
    </>)
}
