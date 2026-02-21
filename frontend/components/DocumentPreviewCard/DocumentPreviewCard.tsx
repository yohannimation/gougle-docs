'use client';

import Link from 'next/link';
import { useDocument } from '@/hooks/useDocument';

import { Editor, useEditor, EditorContent } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import { ListKit } from '@tiptap/extension-list';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';

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
                ListKit,
                TextAlign.configure({ types: ['heading', 'paragraph'] }),
                Underline,
            ],
            immediatelyRender: false,
            editorProps: {
                attributes: {
                    class: 'w-full h-full',
                },
            },
        },
        [document?.content]
    );

    const dialogHeader = (
        <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
        </DialogHeader>
    );

    let dialogContent;
    if (error) {
        dialogContent = <p>Error</p>;
    } else {
        if (!isLoading && document) {
            dialogContent = <EditorContent editor={editor} />;
        } else {
            dialogContent = <Loader />;
        }
    }

    const dialogFooter = (
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
            <DialogContent>
                {dialogHeader}
                <div className="no-scrollbar h-[70dvh] overflow-y-auto border rounded-md bg-slate-50 py-2 px-3">
                    {dialogContent}
                </div>
                {dialogFooter}
            </DialogContent>
        </Dialog>
    );
}
