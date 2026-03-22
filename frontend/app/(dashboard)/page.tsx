'use client';

import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';

import FeatureCard from '@/components/Home/FeatureCard/FeatureCard';

import {
    ArrowRight,
    FilePlusCorner,
    Github,
    PencilLine,
    Share2,
} from 'lucide-react';

import type { FeatureInterface } from '@/interface/Feature.interface';
import Slider from '@/components/Home/Slider/Slider';

export default function Home() {
    const features: FeatureInterface[] = [
        {
            name: 'Collaborate',
            description:
                "Every keystroke is synchronized within milliseconds. Multiple people can edit the same document at the same time without overwriting each other's work.",
            imgUrl: '/collaborative.mp4',
        },
        {
            name: 'Format',
            description:
                'A smooth writing and reading experience: headings, bold, italic, highlighting... Everything you need, nothing unnecessary.',
            imgUrl: '/format.mp4',
        },
        {
            name: 'Structure',
            description:
                'Add a table in two clicks, adjust columns, add rows, fill cells, merge cells, add or delete rows on the fly.',
            imgUrl: '/structure.mp4',
        },
        {
            name: 'List',
            description:
                'Bullet lists, numbered lists, checkboxes... Organize your notes, reports, or to-do lists without leaving the editor.',
            imgUrl: '/list.mp4',
        },
    ];

    const usage: FeatureInterface[] = [
        {
            name: 'Create',
            description:
                'Two clicks are all it takes. Your document is ready in a second.',
            imgUrl: 'https://localhost:3000',
            icon: <FilePlusCorner className="size-5" />,
        },
        {
            name: 'Share',
            description:
                'Send the URL to your collaborators. No account required to join.',
            imgUrl: 'https://localhost:3000',
            icon: <Share2 className="size-5" />,
        },
        {
            name: 'Edit',
            description: 'Edit in real time. Changes sync instantly.',
            imgUrl: 'https://localhost:3000',
            icon: <PencilLine className="size-5" />,
        },
    ];

    return (
        <>
            <section
                className="
                    mb-10 p-6
                    grid grid-cols-1 md:grid-cols-2 gap-6
                    h-fit md:h-[50dvh] lg:h-[75dvh]
                    rounded-4xl
                    bg-blue-200
                    shadow-xl
                "
            >
                <div
                    className="
                        flex flex-col justify-center gap-3
                        h-fit md:h-full
                    "
                >
                    <h1>Gougle Docs - Write together</h1>
                    <p>
                        <span className="text-xl font-semibold">
                            The real-time collaborative text editor
                        </span>
                        .
                        <br />
                        Your changes appear instantly for your collaborators
                        without reloading and without conflicts.
                    </p>
                    <Link href="/docs" className="w-fit" title="Discover">
                        <Button
                            variant="outline"
                            size="xl"
                            className="w-fit hover:gap-3"
                        >
                            Discover <ArrowRight />
                        </Button>
                    </Link>
                </div>
                <div
                    className="
                        relative
                        h-[35svh] md:h-full
                        bg-white rounded-lg
                        overflow-hidden
                    "
                >
                    <Image
                        src={'/gougle-docs-hero.png'}
                        alt="application"
                        fill
                        className="object-contain"
                    />
                </div>
            </section>
            <section className="py-6 flex flex-col gap-3">
                <h2>Some features</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            imgUrl={feature.imgUrl}
                            name={feature.name}
                            description={feature.description}
                        />
                    ))}
                </ul>
                <Link
                    href="/docs"
                    className="mx-auto mt-20"
                    title="View documents"
                >
                    <Button variant="default" size="xl">
                        View documents <ArrowRight />
                    </Button>
                </Link>
            </section>
            <section className="py-20 flex flex-col gap-3">
                <h2>Easy to use</h2>
                <Slider items={usage} />
            </section>
            <hr />
            <section className="py-20 flex flex-col gap-3">
                <h2>A project born from curiosity</h2>
                <p>
                    Gougle Docs started simply: a lesson on Socket.io, an idea,
                    and the desire to see how far I could go.
                    <br />
                    Rather than building yet another demo project, I wanted to
                    challenge myself by creating a fully-fledged collaborative
                    editor from end to end.
                    <br />
                    This project was an opportunity to deliberately step out of
                    my comfort zone and get hands-on with technologies I had
                    never used before.
                </p>
            </section>
            <section
                className="
                    mb-10 p-10
                    flex flex-col items-center gap-3
                    rounded-4xl
                    bg-blue-200
                    shadow-xl
                "
            >
                <h2>Ready to discover ?</h2>
                <p>
                    <span className="text-xl">
                        It's free, no account required, and open to everyone.
                    </span>
                </p>
                <div className="flex gap-3">
                    <Link
                        href="https://github.com/yohannimation/gougle-docs"
                        className="w-fit"
                        title="Gougle docs Github"
                    >
                        <Button variant="default" className="w-fit">
                            View more <Github />
                        </Button>
                    </Link>
                    <Link href="/docs" className="w-fit" title="Discover">
                        <Button variant="outline" className="w-fit">
                            Discover <ArrowRight />
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    );
}
