import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';

import { ButtonGroup } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';

import { setLink } from '@/lib/utils';

import { ExternalLink, Link2Off, PencilLine } from 'lucide-react';

interface TipTapMenuProps {
    editor: Editor | null;
    editable: boolean;
}

export default function TipTapAnchorBubbleMenu({
    editor,
    editable,
}: TipTapMenuProps) {
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
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLink(editor)}
                >
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
