'use client';
import { useEffect, useMemo } from 'react';
import { useDocument } from '@/hooks/useDocument';
import { useParams } from 'next/navigation';
import { useTiptapCollaboration } from '@/hooks/useTiptapCollaboration';

import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Collaboration from '@tiptap/extension-collaboration';
import { Editor } from '@tiptap/react';

import { Button } from '@/components/ui/button';

import ConnectionBadge from '@/components/ConnectionBadge/ConnectionBadge';
import Loader from '@/components/Loader/Loader';
import TipTapMenu from '@/components/TipTapMenu/TipTapMenu';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'ws://localhost:3001';

export default function DocsEditor() {
    const { docId } = useParams<{ docId: string }>();

    // Chargement des métadonnées du document (nom, droits, etc.)
    const { document, isLoading, error } = useDocument(docId, true);

    // userName stable pour éviter les reconnexions
    const userName = useMemo(
        () => 'User ' + Math.floor(Math.random() * 1000),
        []
    );

    // ── Collaboration Socket.io + Y.js ─────────────────────────────────────────
    const { ydoc, connectionStatus, isSynced } = useTiptapCollaboration({
        docId,
        socketUrl: SOCKET_URL,
        userName,
    });

    // ── Éditeur Tiptap ────────────────────────────────────────────────────────
    // N'initialiser l'éditeur QUE quand le ydoc est synchronisé
    const editor: Editor | null = useEditor(
        {
            editable: false,
            extensions: [
                StarterKit.configure({ history: false }),
                Highlight,
                TextAlign.configure({ types: ['heading', 'paragraph'] }),

                ...(ydoc && isSynced
                    ? [
                          Collaboration.configure({
                              document: ydoc,
                          }),
                      ]
                    : []),
            ],
            immediatelyRender: false,
            autofocus: true,
            injectCSS: false,
            editorProps: {
                attributes: {
                    class: 'min-h-[156px] border rounded-md bg-slate-50 py-2 px-3',
                },
            },
        },
        [ydoc, isSynced] // Recréer l'éditeur quand isSynced passe à true
    );

    // ── Mise à jour des droits d'édition ──────────────────────────────────────
    useEffect(() => {
        if (!editor || isLoading) return;
        editor.setEditable(document?.isEditable ?? false);
    }, [editor, document?.isEditable, isLoading]);

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

    if (isLoading && !document) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="text-red-500 text-center">
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
            <div className="flex items-center justify-between mb-5">
                <h1 className="mb-5">{document?.name}</h1>
                <div className="flex items-center gap-3">
                    {/* {isSaving && (
                        <span className="text-xs text-muted-foreground animate-pulse">
                            Sauvegarde…
                        </span>
                    )} */}
                    <ConnectionBadge status={connectionStatus} />
                </div>
            </div>
            <div className="flex flex-col gap-3">
                {editor && (
                    <>
                        <TipTapMenu
                            editor={editor}
                            editable={document?.isEditable || false}
                        />
                        <EditorContent editor={editor} />
                    </>
                )}
            </div>
        </>
    );
}
