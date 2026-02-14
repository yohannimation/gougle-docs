import { ButtonGroup } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';

import { Editor } from '@tiptap/react';

import {
    Bold,
    Highlighter,
    Italic,
    Strikethrough,
    TextAlignCenter,
    TextAlignEnd,
    TextAlignJustify,
    TextAlignStart,
} from 'lucide-react';

interface TipTapMenuProps {
    editor: Editor | null;
    editable: boolean;
}

export default function TipTapMenu({ editor, editable }: TipTapMenuProps) {
    if (!editor) {
        return null;
    }

    return (
        <div className="flex gap-3">
            <ButtonGroup>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    className={
                        editor.isActive('heading', { level: 1 })
                            ? 'bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white'
                            : ''
                    }
                    disabled={!editable}
                >
                    Titre 1
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={
                        editor.isActive('heading', { level: 2 })
                            ? 'bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white'
                            : ''
                    }
                    disabled={!editable}
                >
                    Titre 2
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    className={
                        editor.isActive('heading', { level: 3 })
                            ? 'bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white'
                            : ''
                    }
                    disabled={!editable}
                >
                    Titre 3
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={
                        editor.isActive('paragraph')
                            ? 'bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white'
                            : ''
                    }
                    disabled={!editable}
                >
                    Paragraph
                </Button>
            </ButtonGroup>

            <ButtonGroup>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={
                        editor.isActive('bold')
                            ? 'bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white'
                            : ''
                    }
                    disabled={!editable}
                >
                    <Bold /> Bold
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={
                        editor.isActive('italic')
                            ? 'bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white'
                            : ''
                    }
                    disabled={!editable}
                >
                    <Italic /> Italic
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={
                        editor.isActive('strike')
                            ? 'bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white'
                            : ''
                    }
                    disabled={!editable}
                >
                    <Strikethrough /> Strike
                </Button>
            </ButtonGroup>

            <Button
                variant="outline"
                size="sm"
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                className={
                    editor.isActive('highlight')
                        ? 'bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white'
                        : ''
                }
                disabled={!editable}
            >
                <Highlighter /> Highlight
            </Button>

            <ButtonGroup>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().setTextAlign('left').run()
                    }
                    className={
                        editor.isActive({ textAlign: 'left' })
                            ? 'bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white'
                            : ''
                    }
                    disabled={!editable}
                >
                    <TextAlignStart /> Left
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().setTextAlign('center').run()
                    }
                    className={
                        editor.isActive({ textAlign: 'center' })
                            ? 'bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white'
                            : ''
                    }
                    disabled={!editable}
                >
                    <TextAlignCenter /> Center
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().setTextAlign('right').run()
                    }
                    className={
                        editor.isActive({ textAlign: 'right' })
                            ? 'bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white'
                            : ''
                    }
                    disabled={!editable}
                >
                    <TextAlignEnd /> Right
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().setTextAlign('justify').run()
                    }
                    className={
                        editor.isActive({ textAlign: 'justify' })
                            ? 'bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white'
                            : ''
                    }
                    disabled={!editable}
                >
                    <TextAlignJustify /> Justify
                </Button>
            </ButtonGroup>
        </div>
    );
}
