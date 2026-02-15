import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

import { EarthIcon, Github, File } from 'lucide-react';

export default function Header() {
    return (
        <header className="sticky top-0 z-10 backdrop-blur-xl backdrop-grayscale-50 flex justify-between items-center py-4 px-10 border-b-1">
            <Link href="/" title="Home page">
                Gougle doc
            </Link>
            <div className="flex items-end gap-2">
                <Link
                    href="/docs"
                    className="flex items-center gap-2"
                    title="New document"
                >
                    <Button variant="default">
                        <File />{' '}
                        <span className="hidden sm:inline">Documents</span>
                    </Button>
                </Link>

                <ButtonGroup>
                    <Button size="icon" variant="outline" title="My GitHub">
                        <Link
                            href="https://github.com/yohannimation"
                            target="_blank"
                        >
                            <Github />
                        </Link>
                    </Button>
                    <Button size="icon" variant="outline" title="My Portfolio">
                        <Link href="https://yohannimation.fr" target="_blank">
                            <EarthIcon />
                        </Link>
                    </Button>
                </ButtonGroup>
            </div>
        </header>
    );
}
