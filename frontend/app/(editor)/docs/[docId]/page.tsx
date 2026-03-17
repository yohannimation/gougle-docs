'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useDocument } from '@/hooks/useDocument';
import { useDocumentNameUpdateForm } from '@/hooks/useDocumentNameUpdateForm';
import { useTiptapCollaboration } from '@/hooks/useTiptapCollaboration';
import { useToast } from '@/hooks/useToast';

import {
    getRandomAnimal,
    getRandomLightColor,
    isAllowedUri,
    shouldAutoLink,
} from '@/lib/utils';

import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCaret from '@tiptap/extension-collaboration-caret';
import { CharacterCount } from '@tiptap/extensions';
import Highlight from '@tiptap/extension-highlight';
import { ListKit } from '@tiptap/extension-list';
import StarterKit from '@tiptap/starter-kit';
import { TableKit } from '@tiptap/extension-table';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Editor } from '@tiptap/react';

import { Button } from '@/components/ui/button';

import Loader from '@/components/Loader/Loader';
import TipTapBubbleMenu from '@/components/TipTapBubbleMenu/TipTapBubbleMenu';
import TipTapHeader from '@/components/TipTapHeader/TipTapHeader';
import TipTapMenu from '@/components/TipTapMenu/TipTapMenu';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'ws://localhost:3001';

export default function DocsEditor() {
    const { docId } = useParams<{ docId: string }>();
    const characterLimit = 32768;

    // Loading document data (name, content, etc.)
    const { document, isLoading, error, updateDocument } = useDocument(
        docId,
        true
    );

    // Toast notification
    const toast = useToast();
    const warningShownRef = useRef(false);
    const errorShownRef = useRef(false);

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
            editable: true,
            extensions: [
                CharacterCount.configure({
                    limit: characterLimit,
                }),
                StarterKit.configure({
                    undoRedo: false,
                    link: {
                        openOnClick: false,
                        autolink: true,
                        defaultProtocol: 'https',
                        protocols: ['http', 'https'],
                        isAllowedUri,
                        shouldAutoLink,
                    },
                }),
                Highlight,
                ListKit,
                TableKit.configure({
                    table: {
                        resizable: true,
                        renderWrapper: true,
                        lastColumnResizable: false,
                    },
                }),
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
                    class: 'h-full overflow-y-auto border border-blue-200 rounded-xl bg-white py-2 px-3 shadow-lg ',
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
                canUndo: editor.can().chain().focus().undo().run(),
                canRedo: editor.can().chain().focus().redo().run(),
                isActiveLink: editor.isActive('link'),
                isActiveHeading1: editor.isActive('heading', { level: 1 }),
                isActiveHeading2: editor.isActive('heading', { level: 2 }),
                isActiveHeading3: editor.isActive('heading', { level: 3 }),
                isActiveParagraph: editor.isActive('paragraph'),
                isActiveBold: editor.isActive('bold'),
                isActiveItalic: editor.isActive('italic'),
                isActiveUnderline: editor.isActive('underline'),
                isActiveStrike: editor.isActive('strike'),
                isActiveBulletList: editor.isActive('bulletList'),
                isActiveOrderedList: editor.isActive('orderedList'),
                isActiveTaskList: editor.isActive('taskList'),
                isActiveHighlight: editor.isActive('highlight'),
                isActiveHorizontalRule: editor.isActive('horizontalRule'),
                isActiveLeft: editor.isActive({ textAlign: 'left' }),
                isActiveCenter: editor.isActive({ textAlign: 'center' }),
                isActiveRight: editor.isActive({ textAlign: 'right' }),
                isActiveJustify: editor.isActive({ textAlign: 'justify' }),
            };
        },
    });

    // Toast utils
    useEffect(() => {
        if (!editor) return;

        let timer;

        const checkLimit = () => {
            const count = editor.storage.characterCount.characters();

            // Error (limit reached)
            if (count >= characterLimit && !errorShownRef.current) {
                toast.error(`Character limit reached: ${characterLimit}`);
                errorShownRef.current = true;
            }

            // Warning (80%)
            else if (
                count >= characterLimit * 0.8 &&
                !warningShownRef.current
            ) {
                toast.warning(
                    `80% character limit reached: ${count}/${characterLimit}`
                );
                warningShownRef.current = true;
            }

            // Reset if char count below 75%
            if (count < characterLimit * 0.75) {
                warningShownRef.current = false;
                errorShownRef.current = false;
            }
        };

        const onUpdate = () => {
            clearTimeout(timer);
            timer = setTimeout(checkLimit, 500); // Debounce 500ms
        };

        editor.on('update', onUpdate);

        return () => {
            editor.off('update', onUpdate);
            clearTimeout(timer);
        };
    }, [editor, characterLimit]);

    const formik = useDocumentNameUpdateForm(
        document?.name ?? '',
        updateDocument,
        () => {}
    );

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
            <div className="group mb-3 mb-2">
                <TipTapHeader
                    formik={formik}
                    connectionStatus={connectionStatus}
                    users={users}
                />
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
            </div>
            <TipTapBubbleMenu
                editor={editor}
                editable={
                    (!isLoading &&
                        connectionStatus === 'connected' &&
                        document?.isEditable &&
                        !error) ||
                    false
                }
            />
            <div className="flex flex-col gap-3 flex-1 min-h-0">
                {editor && (
                    <>
                        {isLoading && !document ? (
                            <Loader />
                        ) : (
                            <EditorContent
                                editor={editor}
                                className="flex-1 min-h-0"
                            />
                        )}
                    </>
                )}
            </div>
        </>
    );
}
