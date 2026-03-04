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
    const activeBlock = useMemo(() => {
        if (!editor) return 'p';
        if (editor.isActive('heading', { level: 1 })) return 'h1';
        if (editor.isActive('heading', { level: 2 })) return 'h2';
        if (editor.isActive('heading', { level: 3 })) return 'h3';
        return 'p';
    }, [editor, editor?.state]);

    if (!editor) {
        return null;
    }

    return (
        <div className="flex gap-y-1.5 gap-x-3 md:gap-3 sm:flex-wrap pb-3 sm:pb-0 overflow-y-scroll">
            <ButtonGroup>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editable}
                >
                    <Undo />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editable}
                >
                    <Redo />
                </Button>
            </ButtonGroup>

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
                    <Heading1 />{' '}
                    <span className="hidden xl:block">Title 1</span>
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
                    <Heading2 />{' '}
                    <span className="hidden xl:block">Title 2</span>
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
                    <Heading3 />{' '}
                    <span className="hidden xl:block">Title 3</span>
                </Button>
                <Button
                    variant={
                        editor.isActive('paragraph') ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    disabled={!editable}
                >
                    <Pilcrow />{' '}
                    <span className="hidden xl:block">Paragraph</span>
                </Button>
            </ButtonGroup>

            <ButtonGroup>
                <Button
                    variant={editor.isActive('bold') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editable}
                >
                    <Bold />
                </Button>
                <Button
                    variant={editor.isActive('italic') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editable}
                >
                    <Italic />
                </Button>
                <Button
                    variant={
                        editor.isActive('underline') ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleUnderline().run()
                    }
                    disabled={!editable}
                >
                    <Underline />
                </Button>
                <Button
                    variant={editor.isActive('strike') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editable}
                >
                    <Strikethrough />
                </Button>
                <Button
                    variant={
                        editor.isActive('highlight') ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleHighlight().run()
                    }
                    disabled={!editable}
                >
                    <Highlighter />
                </Button>
            </ButtonGroup>

            <ButtonGroup>
                <Button
                    variant={
                        editor.isActive('bulletList') ? 'default' : 'outline'
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
                        editor.isActive('orderedList') ? 'default' : 'outline'
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
                    variant={
                        editor.isActive('taskList') ? 'default' : 'outline'
                    }
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
                    <TextAlignStart />
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
                    <TextAlignCenter />
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
                    <TextAlignEnd />
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
                    <TextAlignJustify />
                </Button>
            </ButtonGroup>
        </div>
    );
}
