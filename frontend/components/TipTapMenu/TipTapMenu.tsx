import { ButtonGroup } from '../ui/button-group'
import { Button } from '../ui/button'

import { Editor } from '@tiptap/react'

import { Bold, Highlighter, Italic, Strikethrough, TextAlignCenter, TextAlignEnd, TextAlignJustify, TextAlignStart } from 'lucide-react'

interface TipTapMenuProps {
    editor: Editor | null
}

export default function TipTapMenu({ editor }: TipTapMenuProps) {
    if (!editor) {
        return null
    }

    return (
        <div className="flex gap-3">
            <ButtonGroup>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive('heading', { level: 1 }) ? 'bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white' : ''}
                >
                    Titre 1
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white' : ''}
                >
                    Titre 2
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive('heading', { level: 3 }) ? 'bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white' : ''}
                >
                    Titre 3
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={editor.isActive('paragraph') ? 'bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white' : ''}
                >
                    Paragraph
                </Button>
            </ButtonGroup>
            
            <ButtonGroup>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white' : ''}
                >
                    <Bold /> Bold
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white' : ''}
                >
                    <Italic /> Italic
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={editor.isActive('strike') ? 'bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white' : ''}
                >
                    <Strikethrough /> Strike
                </Button>
            </ButtonGroup>
            
            <Button
                variant="outline"
                size="sm"
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                className={editor.isActive('highlight') ? 'bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white' : ''}
            >
                <Highlighter /> Highlight
            </Button>
            
            <ButtonGroup>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={editor.isActive({ textAlign: 'left' }) ? 'bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white' : ''}
                >
                    <TextAlignStart /> Left
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={editor.isActive({ textAlign: 'center' }) ? 'bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white' : ''}
                >
                    <TextAlignCenter /> Center
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={editor.isActive({ textAlign: 'right' }) ? 'bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white' : ''}
                >
                    <TextAlignEnd /> Right
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    className={editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white' : ''}
                >
                    <TextAlignJustify /> Justify
                </Button>
            </ButtonGroup>
        </div>
    )
}