'use client';
import { useState } from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import { useDocumentCreationForm } from '@/hooks/useDocumentCreationForm';

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';

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
                <ContextMenuTrigger className="block h-full">
                    <h1>Docs</h1>
                    <DocumentsList
                        documents={documents}
                        isLoading={isLoading}
                        deleteDocument={deleteDocument}
                    />
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
