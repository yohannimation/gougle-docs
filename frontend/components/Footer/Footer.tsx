import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';

import { ExternalLink } from 'lucide-react';

export default function Footer() {
    return (
        <footer
            className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center py-4 px-4 md:px-10 border-t-1 shadow-sm"
        >
            <Link
                href="/"
                title="Home page"
                className="flex items-center gap-3 font-(family-name:--font-lexend) text-xl h-[46px]"
            >
                <Image
                    src={'/gougle-docs-logo.svg'}
                    alt="app logo"
                    height={18}
                    width={18}
                />{' '}
                Gougle Docs
            </Link>
            <div className="flex items-start sm:items-end flex-col">
                <Link
                    href="/legal-notices"
                    title="See legal notices"
                >
                    <Button variant="link" className='p-0'>
                        Legal notices
                    </Button>
                </Link>
                <a
                    href="https://yohannimation.fr"
                    target='_blank'
                    title="Visit Yohannimation portfolio"
                >
                    <Button variant="link" className='p-0! flex flex-row-reverse sm:flex-row'>
                        <ExternalLink /> Yohannimation portfolio
                    </Button>
                </a>
            </div>
        </footer>
    );
}
