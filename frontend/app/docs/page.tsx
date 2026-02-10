'use client'
import { useDocuments } from '@/hooks/useDocuments'

import DocumentCard from "@/components/DocumentCard/DocumentCard";
import DocumentCardSkeleton from "@/components/DocumentCardSkeleton/DocumentCardSkeleton";

export default function Docs() {
    const { documents, isLoading, error, createDocument, deleteDocument } = useDocuments()

    // Skeleton cards
    const skeletons = [...Array(10)].map((_, i) => (
        <li key={i}><DocumentCardSkeleton /></li>
    ));

    if (isLoading) {
        return (<>
            <h1>Docs</h1>
            <ul className="mt-3 grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
                { skeletons }
            </ul>
        </>)
    }

    return (<>
        <h1>Docs</h1>
        <ul className="mt-3 grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
            {documents.map(document => (
                <li key={document.id}>
                    <DocumentCard document={document} deleteDocument={deleteDocument} />
                </li>
            ))}
        </ul>
    </>)
}
