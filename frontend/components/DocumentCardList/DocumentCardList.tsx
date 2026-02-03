import { JSX } from "react";

import DocumentCard from "../DocumentCard/DocumentCard";

import type { DocumentCardListInterface, DocumentCardInterface } from "../../interface/Document.interface";

interface DocumentCardListProps {
    documents: DocumentCardListInterface
}

export default function DocumentCardList({documents}: DocumentCardListProps) {
    let documentsList: JSX.Element[] = []
    if (documents.length > 0) {
        documentsList = documents.map((document: DocumentCardInterface) => {
            return <li key={document.id}>
                    <DocumentCard document={document}/>
                </li>
        })
    }

    return (
        <ul className="mt-3 grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
            { documentsList.length > 0 ? documentsList : <p>No document created</p> }
        </ul>
    );
}