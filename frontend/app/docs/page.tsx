'use client';
import { useDocuments } from '@/hooks/useDocuments';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { Button } from '@/components/ui/button';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import DocumentCard from '@/components/DocumentCard/DocumentCard';
import DocumentCardSkeleton from '@/components/DocumentCardSkeleton/DocumentCardSkeleton';
import FormDocumentCreation from '@/components/Forms/FormDocumentCreation/FormDocumentCreation';

import { FilePlusCorner, Plus } from 'lucide-react';
import { useState } from 'react';

export default function Docs() {
    const { documents, isLoading, error, createDocument, deleteDocument } =
        useDocuments();
    const [creationDialogOpen, setCreationDialogOpen] =
        useState<boolean>(false);

    const validationSchema = Yup.object({
        name: Yup.string()
            .min(2, 'Must have min 2 characters')
            .max(32, 'Must have max 32 characters')
            .required('Document name is required'),
    });
    const formik = useFormik({
        initialValues: {
            name: '',
            isEditable: true,
            content: '',
        },
        validationSchema,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async (values) => {
            try {
                const creationResult = await createDocument(values);
            } catch (err: any) {
                console.error(err);
            } finally {
                setCreationDialogOpen(false);
                formik.resetForm();
            }
        },
    });

    // Skeleton cards
    const skeletons = [...Array(10)].map((_, i) => (
        <li key={i}>
            <DocumentCardSkeleton />
        </li>
    ));

    return (
        <div className="relative h-full">
            <ContextMenu>
                <ContextMenuTrigger className="block h-full">
                    <h1>Docs</h1>
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

                    <ContextMenuContent>
                        <ContextMenuItem
                            onClick={(e) => setCreationDialogOpen(true)}
                        >
                            Create new document
                        </ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenuTrigger>
            </ContextMenu>

            {/* Create document part */}
            <Dialog
                open={creationDialogOpen}
                onOpenChange={setCreationDialogOpen}
            >
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button
                                variant="default"
                                size="icon-lg"
                                className="rounded-full size-15 absolute bottom-0 right-0"
                                onClick={(e) => setCreationDialogOpen(true)}
                            >
                                <FilePlusCorner className="size-8" />
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Create new document</p>
                    </TooltipContent>
                </Tooltip>

                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Create new document</DialogTitle>
                    </DialogHeader>
                    <FormDocumentCreation formik={formik} />
                    <DialogFooter>
                        <Button onClick={() => formik.handleSubmit}>
                            <Plus /> Create
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
