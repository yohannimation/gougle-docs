'use client';

import { useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useDocument } from '@/hooks/useDocument';
import { useTiptapCollaboration } from '@/hooks/useTiptapCollaboration';

import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCaret from '@tiptap/extension-collaboration-caret';
import Highlight from '@tiptap/extension-highlight';
import { ListKit } from '@tiptap/extension-list';
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
    let lightness = 70 + Math.floor(Math.random() * 20); // 70-90% : light color

    // Conversion HSL -> RGB
    lightness /= 100;
    const a = (saturation * Math.min(lightness, 1 - lightness)) / 100;
    const f = (n) => {
        const k = (n + hue / 30) % 12;
        const color = lightness - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, '0'); // Convert to Hex and prefix "0" if needed
    };

    return `#${f(0)}${f(8)}${f(4)}`;
}

export default function DocsEditor() {
    const { docId } = useParams<{ docId: string }>();

    // Loading document data (name, content, etc.)
    const { document, isLoading, error, updateDocument } = useDocument(
        docId,
        true
    );

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
                StarterKit.configure({ undoRedo: false }),
                Highlight,
                ListKit,
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
                isActiveBulletList: editor.isActive('bulletList'),
                isActiveOrderedList: editor.isActive('orderedList'),
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
                <Button variant="secondary">Home</Button>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between gap-3 mb-3 md:mb-5">
                <h1>{document.name}</h1>
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
