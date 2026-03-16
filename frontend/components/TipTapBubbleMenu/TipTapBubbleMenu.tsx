import { Editor } from '@tiptap/react';
import { findParentNode, posToDOMRect } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';

import { ButtonGroup } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';

import { setLink } from '@/lib/utils';

import { ExternalLink, Link2Off, PencilLine, Trash } from 'lucide-react';

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
        <>
            {/* ====== Link bubble menu ====== */}
            <BubbleMenu
                editor={editor}
                pluginKey="linkBubbleMenu"
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
                            window.open(
                                editor.getAttributes('link').href,
                                '_blank'
                            )
                        }
                    >
                        {/* Open external link */}
                        <ExternalLink />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setLink(editor)}
                    >
                        {/* Edit link */}
                        <PencilLine />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().unsetLink().run()}
                    >
                        {/* Delete link */}
                        <Link2Off />
                    </Button>
                </ButtonGroup>
            </BubbleMenu>

            {/* ====== Table bubble menu ====== */}
            <BubbleMenu
                editor={editor}
                pluginKey="tableBubbleMenu"
                shouldShow={() => editor.isActive('table')}
                getReferencedVirtualElement={() => {
                    const parentNode = findParentNode(
                        (node) => node.type.name === 'table'
                    )(editor.state.selection);
                    if (parentNode) {
                        const domRect = posToDOMRect(
                            editor.view,
                            parentNode.start,
                            parentNode.start + parentNode.node.nodeSize
                        );
                        return {
                            getBoundingClientRect: () => domRect,
                            getClientRects: () => [domRect],
                        };
                    }
                    return null;
                }}
                options={{ placement: 'top', offset: 8 }}
            >
                <div className="flex flex-col-reverse sm:flex-row gap-1.5">
                    <ButtonGroup className="rounded-lg">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                editor.chain().focus().toggleHeaderRow().run()
                            }
                        >
                            {/* Add column header */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                />
                                <path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14" />
                                <path d="M9 3l-6 6" />
                                <path d="M14 3l-7 7" />
                                <path d="M19 3l-7 7" />
                                <path d="M21 6l-4 4" />
                                <path d="M3 10h18" />
                                <path d="M10 10v11" />
                            </svg>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                editor.chain().focus().addColumnBefore().run()
                            }
                        >
                            {/* Add column left (before) */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                />
                                <path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1" />
                                <path d="M5 12l4 0" />
                                <path d="M7 10l0 4" />
                            </svg>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                editor.chain().focus().addColumnAfter().run()
                            }
                        >
                            {/* Add column right (after) */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                />
                                <path d="M6 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1" />
                                <path d="M15 12l4 0" />
                                <path d="M17 10l0 4" />
                            </svg>
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                                editor.chain().focus().deleteColumn().run()
                            }
                        >
                            {/* Delete column */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                />
                                <path d="M6 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1" />
                                <path d="M16 10l4 4" />
                                <path d="M16 14l4 -4" />
                            </svg>
                        </Button>
                    </ButtonGroup>
                    <ButtonGroup className="rounded-lg">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeaderColumn()
                                    .run()
                            }
                        >
                            {/* Add row header */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                />
                                <path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14" />
                                <path d="M10 10h11" />
                                <path d="M10 3v18" />
                                <path d="M9 3l-6 6" />
                                <path d="M10 7l-7 7" />
                                <path d="M10 12l-7 7" />
                                <path d="M10 17l-4 4" />
                            </svg>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                editor.chain().focus().addRowBefore().run()
                            }
                        >
                            {/* Add row top (before) */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                />
                                <path d="M4 18v-4a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1" />
                                <path d="M12 9v-4" />
                                <path d="M10 7l4 0" />
                            </svg>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                editor.chain().focus().addRowAfter().run()
                            }
                        >
                            {/* Add row bottom (after) */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                />
                                <path d="M20 6v4a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1" />
                                <path d="M12 15l0 4" />
                                <path d="M14 17l-4 0" />
                            </svg>
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                                editor.chain().focus().deleteRow().run()
                            }
                        >
                            {/* Delete row */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                />
                                <path d="M20 6v4a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1" />
                                <path d="M10 16l4 4" />
                                <path d="M10 20l4 -4" />
                            </svg>
                        </Button>
                    </ButtonGroup>
                    <ButtonGroup className="rounded-lg">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                editor.chain().focus().mergeCells().run()
                            }
                        >
                            {/* Merge cells */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="rotate-90"
                            >
                                <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                />
                                <path d="M12 3v6l3 -3m-6 0l3 3" />
                                <path d="M12 21v-6l3 3m-6 0l3 -3" />
                                <path d="M4 12l1 0" />
                                <path d="M9 12l1 0" />
                                <path d="M14 12l1 0" />
                                <path d="M19 12l1 0" />
                            </svg>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                editor.chain().focus().splitCell().run()
                            }
                        >
                            {/* Split cell */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                />
                                <path d="M8 12h-6" />
                                <path d="M5 15l-3 -3l3 -3" />
                                <path d="M22 12h-6" />
                                <path d="M19 15l3 -3l-3 -3" />
                                <path d="M12 4v16" />
                            </svg>
                        </Button>
                    </ButtonGroup>
                    <ButtonGroup className="rounded-lg">
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                                editor.chain().focus().deleteTable().run()
                            }
                        >
                            {/* Delete table */}
                            <Trash /> Table
                        </Button>
                    </ButtonGroup>
                </div>
            </BubbleMenu>
        </>
    );
}
