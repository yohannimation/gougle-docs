import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

import { EarthIcon, Github, File } from 'lucide-react';

export default function Header() {
    return (
        <header
            className="sticky top-0 z-10 flex justify-between items-center py-4 px-10 border-b-1 shadow-sm"
            style={{
                backdropFilter: 'blur(24px) grayscale(50%)',
            }}
        >
            <Link
                href="/"
                title="Home page"
                className="flex items-center gap-3 font-(family-name:--font-lexend) text-xl"
            >
                <Image
                    src={'/gougle-docs-logo.svg'}
                    alt="app logo"
                    height={18}
                    width={18}
                />{' '}
                Gougle Docs
            </Link>
            <div className="flex items-end gap-3">
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

                <ButtonGroup className="rounded-xl">
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
