'use client';
import { useState } from 'react';
import { useDocumentCreationForm } from '@/hooks/useDocumentCreationForm';
import { useDocuments } from '@/hooks/useDocuments';

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

import DocumentCreationDialog from '@/components/DocumentCreationDialog/DocumentCreationDialog';
import DocumentsList from '@/components/DocumentsList/DocumentsList';

export default function Docs() {
    const { documents, isLoading, error, createDocument, deleteDocument } =
        useDocuments();
    const [creationDialogOpen, setCreationDialogOpen] =
        useState<boolean>(false);

    const formik = useDocumentCreationForm(createDocument, () =>
        setCreationDialogOpen(false)
    );

    return (
        <div className="relative h-full">
            <ContextMenu>
                <ContextMenuTrigger className="flex flex-col h-full">
                    <h1>Docs</h1>
                    <ScrollArea className="mt-3 flex-1 min-h-0">
                        <DocumentsList
                            documents={documents}
                            isLoading={isLoading}
                            deleteDocument={deleteDocument}
                        />
                    </ScrollArea>
                </ContextMenuTrigger>

                <ContextMenuContent>
                    <ContextMenuItem
                        onClick={(e) => setCreationDialogOpen(true)}
                    >
                        Create new document
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>

            <DocumentCreationDialog
                creationDialogOpen={creationDialogOpen}
                setCreationDialogOpen={setCreationDialogOpen}
                formik={formik}
            />
        </div>
    );
}
