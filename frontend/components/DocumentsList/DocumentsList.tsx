import DocumentCard from '@/components/DocumentCard/DocumentCard';
import DocumentCardSkeleton from '@/components/DocumentCardSkeleton/DocumentCardSkeleton';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';

import { FileX } from 'lucide-react';

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

    if (documents.length == 0 && !isLoading) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <FileX />
                    </EmptyMedia>
                    <EmptyTitle>No documents yet</EmptyTitle>
                    <EmptyDescription>
                        You haven't created any documents.
                        <br />
                        Get started by creating your first file.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    return (
        <ul className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
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
