'use client'
import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import { useEditor, EditorContent, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import { Spinner } from '@/components/ui/spinner'

import TipTapMenu from '@/components/TipTapMenu/TipTapMenu'

import { Editor } from '@tiptap/react'

export default function DocsEditor() {
    const { docId } = useParams()
    const [content, setContent] = useState('');
    const [editable, setEditable] = useState<boolean>(false)

    const editor: Editor | null = useEditor({
        content,
        editable,
        extensions: [
            StarterKit,
            Highlight,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            })
        ],
        immediatelyRender: false,
        autofocus: true,
        injectCSS: false,
        editorProps: {
            attributes: {
                class: "min-h-[156px] border rounded-md bg-slate-50 py-2 px-3"
            }
        },
    })

    const editorState = useEditorState({
        editor,
        selector: ({ editor }) => {
            if (!editor) return null;
        
            return {
                isActiveHeading1: editor.isActive('heading', { level: 1 }),
                isActiveHeading2: editor.isActive('heading', { level: 2 }),
                isActiveHeading3: editor.isActive('heading', { level: 3 }),
                isActiveParagraph: editor.isActive("paragraph"),
                isActiveBold: editor.isActive("bold"),
                isActiveItalic: editor.isActive("italic"),
                isActiveStrike: editor.isActive("strike"),
                isActiveHighlight: editor.isActive("highlight"),
                isActiveLeft: editor.isActive({ textAlign: 'left' }),
                isActiveCenter: editor.isActive({ textAlign: 'center'}),
                isActiveRight: editor.isActive({ textAlign: 'right' }),
                isActiveJustify: editor.isActive({ textAlign: 'justify' })
            };
        },
    });

    // Asynchronous fetch data
    useEffect(() => {
        setTimeout(() => {
            setContent("<p>my content</p>")
            setEditable(true)
            
            editor?.commands.setContent(content)
            editor?.setEditable(editable)
        }, 2000)
    }, [docId, editor, content, editable])

    return (<>
        <h1 className='mb-5'>editor {docId}</h1>
        <div className='flex flex-col gap-3'>
            {
                editor && content !== '' ? (
                    <>
                        <TipTapMenu editor={editor} editable={editable} />
                        <EditorContent editor={editor} />
                    </>
                ) : (
                    <>
                        <Spinner className="m-auto mt-20 size-8" />
                    </>
                )
            }
        </div>
    </>)
}
