'use client';
import { useEffect, useState } from 'react';
import { useDocument } from '@/hooks/useDocument';

import { useParams } from 'next/navigation';

import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { Editor } from '@tiptap/react';

import Loader from '@/components/Loader/Loader';
import TipTapMenu from '@/components/TipTapMenu/TipTapMenu';

export default function DocsEditor() {
    const { docId } = useParams<{ docId: string }>()
    const { document, isLoading, error, fetchDocument } = useDocument(docId);
    const [isEditable, setIsEditable] = useState<boolean>(false);

    const editor: Editor | null = useEditor({
        content: '',
        editable: false,
        extensions: [
            StarterKit,
            Highlight,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        immediatelyRender: false,
        autofocus: true,
        injectCSS: false,
        editorProps: {
            attributes: {
                class: 'min-h-[156px] border rounded-md bg-slate-50 py-2 px-3',
            },
        },
    });

    const editorState = useEditorState({
        editor,
        selector: ({ editor }) => {
            if (!editor) return null;

            return {
                isActiveHeading1: editor.isActive('heading', { level: 1 }),
                isActiveHeading2: editor.isActive('heading', { level: 2 }),
                isActiveHeading3: editor.isActive('heading', { level: 3 }),
                isActiveParagraph: editor.isActive('paragraph'),
                isActiveBold: editor.isActive('bold'),
                isActiveItalic: editor.isActive('italic'),
                isActiveStrike: editor.isActive('strike'),
                isActiveHighlight: editor.isActive('highlight'),
                isActiveLeft: editor.isActive({ textAlign: 'left' }),
                isActiveCenter: editor.isActive({ textAlign: 'center' }),
                isActiveRight: editor.isActive({ textAlign: 'right' }),
                isActiveJustify: editor.isActive({ textAlign: 'justify' }),
            };
        },
    });

    // Asynchronous fetch data
    useEffect(() => {
        fetchDocument()
    }, [fetchDocument])

    // Document initialization
    useEffect(() => {
        if (!editor || !document || isLoading) return;

        try {
            const content = document.content || '<p></p>';
            editor.commands.setContent(content);
            editor.setEditable(document.isEditable);
            editor.commands.focus();
        } catch (err) {
            console.error('Error loading document:', err);
        }
    }, [editor, document, isLoading]);

    // Loading state
    if (isLoading && !document) {
        return <Loader />;
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="text-red-500 text-center">
                    <p className="font-semibold">Error</p>
                    <p className="text-sm">{error}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Try again
                </button>
            </div>
        );
    }

    return (
        <>
            <h1 className="mb-5">{document?.name}</h1>
            <div className="flex flex-col gap-3">
                {editor && (
                    <>
                        <TipTapMenu editor={editor} editable={document?.isEditable || false} />
                        <EditorContent editor={editor} />
                    </>
                )}
            </div>
        </>
    );
}
