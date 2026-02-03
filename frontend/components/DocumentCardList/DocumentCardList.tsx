import { JSX } from "react";

import DocumentCard from "../DocumentCard/DocumentCard";

import type { DocumentCardListInterface, DocumentCardInterface } from "../../interface/Document.interface";
import DocumentCardSkeleton from "../DocumentCardSkeleton/DocumentCardSkeleton";

interface DocumentCardListProps {
    documents: DocumentCardListInterface,
    isLoading: boolean
}

export default function DocumentCardList({documents, isLoading}: DocumentCardListProps) {
    // Documents list
    let documentsList: JSX.Element[] = []
    if (documents.length > 0) {
        documentsList = documents.map((document: DocumentCardInterface) => {
            return <li key={document.id}>
                    <DocumentCard document={document}/>
                </li>
        })
    }

    // Skeleton cards
    const skeletons = [...Array(10)].map((_, i) => (
        <DocumentCardSkeleton key={i} />
    ));

    return (
        <ul className="mt-3 grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
            { isLoading ? (
                <>
                    { skeletons }
                </>
            ) : (
                documentsList.length > 0 ? documentsList : <p>No document created</p>
            )}
        </ul>
    );
}