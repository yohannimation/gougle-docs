'use client';

import Link from 'next/link';
import { useDocument } from '@/hooks/useDocument';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { Editor } from '@tiptap/react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import DeleteButton from '@/components/DeleteButton/DeleteButton';
import Loader from '@/components/Loader/Loader';

import { Eye, PenLine } from 'lucide-react';

interface DocumentPreviewProps {
    id: string;
    name: string;
    deleteDocument: (id: string) => void;
}

export default function DocumentPreviewCard({
    id,
    name,
    deleteDocument,
}: DocumentPreviewProps) {
    const { document, isLoading, error, fetchDocument } = useDocument(id);

    const editor: Editor | null = useEditor(
        {
            content: document?.content,
            editable: false,
            extensions: [
                StarterKit,
                Highlight,
                TextAlign.configure({ types: ['heading', 'paragraph'] }),
            ],
            immediatelyRender: false,
            editorProps: {
                attributes: {
                    class: 'max-width max-height border rounded-md bg-slate-50 py-2 px-3',
                },
            },
        },
        [document?.content]
    );

    const dialogContent = (
        <>
            <DialogHeader>
                <DialogTitle>{name}</DialogTitle>
            </DialogHeader>

            {!isLoading && document ? (
                <div className="no-scrollbar h-[70dvh] overflow-y-auto">
                    <EditorContent editor={editor} />
                </div>
            ) : (
                <Loader />
            )}

            <DialogFooter className="grid grid-cols-2 gap-2">
                {!isLoading && document && document.isEditable && (
                    <>
                        <Link href={`/docs/${document.id}`} target="_blank">
                            <Button className="w-full bg-amber-200 text-amber-700 hover:bg-amber-500 hover:text-white">
                                <PenLine /> Edit
                            </Button>
                        </Link>
                        <DeleteButton
                            id={document.id}
                            deleteDocument={deleteDocument}
                        />
                    </>
                )}
            </DialogFooter>
        </>
    );

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className="w-full bg-slate-200 text-slate-700 hover:bg-slate-500 hover:text-white"
                    onClick={(e) => fetchDocument()}
                >
                    <Eye /> Preview
                </Button>
            </DialogTrigger>
            <DialogContent>{dialogContent}</DialogContent>
        </Dialog>
    );
}
