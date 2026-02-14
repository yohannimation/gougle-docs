import DocumentCard from '@/components/DocumentCard/DocumentCard';
import DocumentCardSkeleton from '@/components/DocumentCardSkeleton/DocumentCardSkeleton';

import { Document } from '@/lib/api/documents';

interface DocumentListProps {
    documents: Document[];
    isLoading: boolean;
    deleteDocument: (id: string) => void;
}

export default function DocumentsList({
    documents,
    isLoading,
    deleteDocument,
}: DocumentListProps) {
    const skeletons = [...Array(5)].map((_, i) => (
        <li key={i}>
            <DocumentCardSkeleton />
        </li>
    ));

    return (
        <ul className="mt-3 grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
            {isLoading
                ? skeletons
                : documents.map((document) => (
                      <li key={document.id}>
                          <DocumentCard
                              document={document}
                              deleteDocument={deleteDocument}
                          />
                      </li>
                  ))}
        </ul>
    );
}
