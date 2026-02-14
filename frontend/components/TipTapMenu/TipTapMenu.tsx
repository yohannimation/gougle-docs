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
                    variant={
                        editor.isActive('heading', { level: 1 })
                            ? 'default'
                            : 'outline'
                    }
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    disabled={!editable}
                >
                    Titre 1
                </Button>
                <Button
                    variant={
                        editor.isActive('heading', { level: 2 })
                            ? 'default'
                            : 'outline'
                    }
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    disabled={!editable}
                >
                    Titre 2
                </Button>
                <Button
                    variant={
                        editor.isActive('heading', { level: 3 })
                            ? 'default'
                            : 'outline'
                    }
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    disabled={!editable}
                >
                    Titre 3
                </Button>
                <Button
                    variant={
                        editor.isActive('paragraph') ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    disabled={!editable}
                >
                    Paragraph
                </Button>
            </ButtonGroup>

            <ButtonGroup>
                <Button
                    variant={editor.isActive('bold') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editable}
                >
                    <Bold /> Bold
                </Button>
                <Button
                    variant={editor.isActive('italic') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editable}
                >
                    <Italic /> Italic
                </Button>
                <Button
                    variant={editor.isActive('strike') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editable}
                >
                    <Strikethrough /> Strike
                </Button>
            </ButtonGroup>

            <Button
                variant={editor.isActive('highlight') ? 'default' : 'outline'}
                size="sm"
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                disabled={!editable}
            >
                <Highlighter /> Highlight
            </Button>

            <ButtonGroup>
                <Button
                    variant={
                        editor.isActive({ textAlign: 'left' })
                            ? 'default'
                            : 'outline'
                    }
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().setTextAlign('left').run()
                    }
                    disabled={!editable}
                >
                    <TextAlignStart /> Left
                </Button>
                <Button
                    variant={
                        editor.isActive({ textAlign: 'center' })
                            ? 'default'
                            : 'outline'
                    }
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().setTextAlign('center').run()
                    }
                    disabled={!editable}
                >
                    <TextAlignCenter /> Center
                </Button>
                <Button
                    variant={
                        editor.isActive({ textAlign: 'right' })
                            ? 'default'
                            : 'outline'
                    }
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().setTextAlign('right').run()
                    }
                    disabled={!editable}
                >
                    <TextAlignEnd /> Right
                </Button>
                <Button
                    variant={
                        editor.isActive({ textAlign: 'justify' })
                            ? 'default'
                            : 'outline'
                    }
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().setTextAlign('justify').run()
                    }
                    disabled={!editable}
                >
                    <TextAlignJustify /> Justify
                </Button>
            </ButtonGroup>
        </div>
    );
}
