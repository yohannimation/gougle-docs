import { useMemo } from 'react';

import { ButtonGroup } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';

import { Editor } from '@tiptap/react';

import {
    Bold,
    Highlighter,
    Italic,
    Heading1,
    Heading2,
    Heading3,
    LayoutList,
    List,
    ListOrdered,
    Pilcrow,
    Redo,
    Strikethrough,
    TextAlignCenter,
    TextAlignEnd,
    TextAlignJustify,
    TextAlignStart,
    Underline,
    Undo,
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
        <div className="flex gap-1.5 sm:flex-wrap p-2 bg-blue-50 border border-blue-200 rounded-xl shadow-lg overflow-y-scroll">
            <ButtonGroup className="rounded-lg">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={
                        !editable || !editor.can().chain().focus().undo().run()
                    }
                >
                    <Undo />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={
                        !editable || !editor.can().chain().focus().redo().run()
                    }
                >
                    <Redo />
                </Button>
            </ButtonGroup>

            <ButtonGroup className="rounded-lg">
                <Button
                    variant={
                        editor.isActive('heading', { level: 1 })
                            ? 'default'
                            : 'ghost'
                    }
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    disabled={!editable}
                >
                    <Heading1 />{' '}
                    <span className="hidden xl:block">Title 1</span>
                </Button>
                <Button
                    variant={
                        editor.isActive('heading', { level: 2 })
                            ? 'default'
                            : 'ghost'
                    }
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    disabled={!editable}
                >
                    <Heading2 />{' '}
                    <span className="hidden xl:block">Title 2</span>
                </Button>
                <Button
                    variant={
                        editor.isActive('heading', { level: 3 })
                            ? 'default'
                            : 'ghost'
                    }
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    disabled={!editable}
                >
                    <Heading3 />{' '}
                    <span className="hidden xl:block">Title 3</span>
                </Button>
                <Button
                    variant={editor.isActive('paragraph') ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    disabled={!editable}
                >
                    <Pilcrow />{' '}
                    <span className="hidden xl:block">Paragraph</span>
                </Button>
            </ButtonGroup>

            <ButtonGroup className="rounded-lg">
                <Button
                    variant={editor.isActive('bold') ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editable}
                >
                    <Bold />
                </Button>
                <Button
                    variant={editor.isActive('italic') ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editable}
                >
                    <Italic />
                </Button>
                <Button
                    variant={editor.isActive('underline') ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleUnderline().run()
                    }
                    disabled={!editable}
                >
                    <Underline />
                </Button>
                <Button
                    variant={editor.isActive('strike') ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editable}
                >
                    <Strikethrough />
                </Button>
                <Button
                    variant={editor.isActive('highlight') ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleHighlight().run()
                    }
                    disabled={!editable}
                >
                    <Highlighter />
                </Button>
            </ButtonGroup>

            <ButtonGroup className="rounded-lg">
                <Button
                    variant={
                        editor.isActive('bulletList') ? 'default' : 'ghost'
                    }
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    disabled={!editable}
                >
                    <List /> <span className="hidden sm:block">Bullet</span>
                </Button>
                <Button
                    variant={
                        editor.isActive('orderedList') ? 'default' : 'ghost'
                    }
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    disabled={!editable}
                >
                    <ListOrdered />{' '}
                    <span className="hidden sm:block">Ordered</span>
                </Button>
                <Button
                    variant={editor.isActive('taskList') ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleTaskList().run()
                    }
                    disabled={!editable}
                >
                    <LayoutList />{' '}
                    <span className="hidden sm:block">Checkbox</span>
                </Button>
            </ButtonGroup>

            <ButtonGroup className="rounded-lg">
                <Button
                    variant={
                        editor.isActive({ textAlign: 'left' })
                            ? 'default'
                            : 'ghost'
                    }
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().setTextAlign('left').run()
                    }
                    disabled={!editable}
                >
                    <TextAlignStart />
                </Button>
                <Button
                    variant={
                        editor.isActive({ textAlign: 'center' })
                            ? 'default'
                            : 'ghost'
                    }
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().setTextAlign('center').run()
                    }
                    disabled={!editable}
                >
                    <TextAlignCenter />
                </Button>
                <Button
                    variant={
                        editor.isActive({ textAlign: 'right' })
                            ? 'default'
                            : 'ghost'
                    }
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().setTextAlign('right').run()
                    }
                    disabled={!editable}
                >
                    <TextAlignEnd />
                </Button>
                <Button
                    variant={
                        editor.isActive({ textAlign: 'justify' })
                            ? 'default'
                            : 'ghost'
                    }
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().setTextAlign('justify').run()
                    }
                    disabled={!editable}
                >
                    <TextAlignJustify />
                </Button>
            </ButtonGroup>
        </div>
    );
}
