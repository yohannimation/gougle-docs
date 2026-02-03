import DocumentCardList from "@/components/DocumentCardList/DocumentCardList";

import type { DocumentCardListInterface } from "../../interface/Document.interface";

export default function Docs() {
    const documents: DocumentCardListInterface = [
        {
            id: "0",
            name: "document test",
            isEditable: false
        }
    ]

    return (<>
        <h1>Docs</h1>
        <DocumentCardList documents={documents} />
    </>)
}
