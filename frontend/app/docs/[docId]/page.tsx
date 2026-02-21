'use client';

import { useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useDocument } from '@/hooks/useDocument';
import { useTiptapCollaboration } from '@/hooks/useTiptapCollaboration';

import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCaret from '@tiptap/extension-collaboration-caret';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Editor } from '@tiptap/react';

import { Button } from '@/components/ui/button';

import ConnectionBadge from '@/components/ConnectionBadge/ConnectionBadge';
import Loader from '@/components/Loader/Loader';
import UsersGroup from '@/components/UsersGroup/UsersGroup';
import TipTapMenu from '@/components/TipTapMenu/TipTapMenu';

import animals from '@/data/animals.json';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'ws://localhost:3001';

function getRandomAnimal(): string {
    return animals[Math.floor(Math.random() * animals.length)];
}

function getRandomLightColor(): string {
    const hue = Math.floor(Math.random() * 360); // 0-360 : all color pallet
    const saturation = 60 + Math.floor(Math.random() * 30); // 60-90% : vivas color but not grey too
    const lightness = 70 + Math.floor(Math.random() * 20); // 70-90% : light color

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export default function DocsEditor() {
    const { docId } = useParams<{ docId: string }>();

    // Loading document data (name, content, etc.)
    const { document, isLoading, error } = useDocument(docId, true);

    const username = useMemo(() => getRandomAnimal(), []);
    const userColor = useMemo(() => getRandomLightColor(), []);

    // Socket.io + Y.js collaboration
    const { ydoc, connectionStatus, users, provider } = useTiptapCollaboration({
        docId,
        socketUrl: SOCKET_URL,
        username,
        userColor,
    });

    // Tiptap editor
    // Initialed only if the Ydoc is initialed
    const editor: Editor | null = useEditor(
        {
            editable: false,
            extensions: [
                StarterKit.configure({ history: false }),
                Highlight,
                TextAlign.configure({ types: ['heading', 'paragraph'] }),
                Underline,
                ...(ydoc && provider
                    ? [
                          Collaboration.configure({
                              document: ydoc,
                          }),
                          CollaborationCaret.configure({
                              provider,
                              user: {
                                  name: username,
                                  color: userColor,
                              },
                          }),
                      ]
                    : []),
            ],
            immediatelyRender: false,
            autofocus: true,
            injectCSS: false,
            editorProps: {
                attributes: {
                    class: 'no-scrollbar h-[70dvh] overflow-y-auto border rounded-md bg-slate-50 py-2 px-3',
                },
            },
        },
        [ydoc, provider]
    );

    // Update edition right
    useEffect(() => {
        if (!editor || isLoading || connectionStatus !== 'connected' || error) {
            editor?.setEditable(false);
        } else {
            editor.setEditable(document?.isEditable ?? false);
        }
    }, [editor, document?.isEditable, isLoading, connectionStatus, error]);

    // Variable not used but very important for the TiptapMenu dynamics
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
                isActiveUderline: editor.isActive('underline'),
                isActiveStrike: editor.isActive('strike'),
                isActiveHighlight: editor.isActive('highlight'),
                isActiveLeft: editor.isActive({ textAlign: 'left' }),
                isActiveCenter: editor.isActive({ textAlign: 'center' }),
                isActiveRight: editor.isActive({ textAlign: 'right' }),
                isActiveJustify: editor.isActive({ textAlign: 'justify' }),
            };
        },
    });

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="text-center">
                    <p className="font-semibold">Erreur</p>
                    <p className="text-sm">{error}</p>
                </div>
                <Button
                    variant="default"
                    onClick={() => window.location.reload()}
                >
                    Réessayer
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between gap-3 mb-3 md:mb-5">
                <h1 className="truncate">{document?.name}</h1>
                <div className="flex items-center gap-3">
                    <ConnectionBadge status={connectionStatus} />
                    <UsersGroup users={users} />
                </div>
            </div>
            <div className="flex flex-col gap-3">
                {editor && (
                    <>
                        <TipTapMenu
                            editor={editor}
                            editable={
                                (!isLoading &&
                                    connectionStatus === 'connected' &&
                                    document?.isEditable &&
                                    !error) ||
                                false
                            }
                        />
                        {isLoading && !document ? (
                            <Loader />
                        ) : (
                            <EditorContent editor={editor} />
                        )}
                    </>
                )}
            </div>
        </>
    );
}
