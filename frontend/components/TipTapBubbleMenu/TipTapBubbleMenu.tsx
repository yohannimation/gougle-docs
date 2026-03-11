import { useCallback } from 'react';

import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';

import { ButtonGroup } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';

import { ExternalLink, Link2Off, PencilLine } from 'lucide-react';

interface TipTapMenuProps {
    editor: Editor | null;
    editable: boolean;
}

export default function TipTapAnchorBubbleMenu({
    editor,
    editable,
}: TipTapMenuProps) {
    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();

            return;
        }

        // update link
        try {
            editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: url, title: 'grebgehgbejhr' })
                .run();
        } catch (e) {
            alert(e.message);
        }
    }, [editor]);

    if (!editor || !editable) {
        return null;
    }

    return (
        <BubbleMenu
            editor={editor}
            shouldShow={() => editor.isActive('link')}
            options={{
                autoPlacement: {
                    allowedPlacements: ['top', 'bottom'],
                },
            }}
        >
            <ButtonGroup className="rounded-lg">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        window.open(editor.getAttributes('link').href, '_blank')
                    }
                >
                    <ExternalLink />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setLink()}>
                    <PencilLine />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().unsetLink().run()}
                >
                    <Link2Off />
                </Button>
            </ButtonGroup>
        </BubbleMenu>
    );
}
