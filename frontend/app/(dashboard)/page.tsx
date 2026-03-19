'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

import FeatureCard from '@/components/Home/FeatureCard/FeatureCard';

import { ArrowRight, FilePlusCorner, PencilLine, Share2 } from 'lucide-react';

import type { FeatureInterface } from '@/interface/Feature.interface';
import Slider from '@/components/Home/Slider/Slider';

export default function Home() {
    const features: FeatureInterface[] = [
        {
            name: 'Collaborate',
            description:
                "Every keystroke is synchronized within milliseconds. Multiple people can edit the same document at the same time without overwriting each other's work.",
            imgUrl: 'https://localhost:3000',
        },
        {
            name: 'Format',
            description:
                'A smooth writing and reading experience: headings, bold, italic, highlighting... Everything you need, nothing unnecessary.',
            imgUrl: 'https://localhost:3000',
        },
        {
            name: 'Structure',
            description:
                'Add a table in two clicks, adjust columns, add rows, fill cells, merge cells, add or delete rows on the fly.',
            imgUrl: 'https://localhost:3000',
        },
        {
            name: 'List',
            description:
                'Bullet lists, numbered lists, checkboxes... Organize your notes, reports, or to-do lists without leaving the editor.',
            imgUrl: 'https://localhost:3000',
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
                    h-[50dvh] md:h-[75dvh]
                    rounded-4xl
                    bg-blue-200
                    shadow-xl
                "
            >
                <div className="flex flex-col justify-center gap-3">
                    <h1>Write together</h1>
                    <p>
                        <strong>Gougle Docs</strong> is a real-time
                        collaborative editor.
                        <br />
                        Your changes appear instantly for your collaborators
                        without reloading and without conflicts.
                    </p>
                    <Link href="/docs" className="w-fit" title="New document">
                        <Button variant="outline" className="w-fit hover:gap-3">
                            Discover <ArrowRight />
                        </Button>
                    </Link>
                </div>
                <div className="bg-white rounded-lg"></div>
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
                    className="mx-auto mt-3"
                    title="New document"
                >
                    <Button variant="default" size="lg">
                        View documents <ArrowRight />
                    </Button>
                </Link>
            </section>
            <section className="py-6 flex flex-col gap-3">
                <h2>Easy to use</h2>
                <Slider items={usage} />
            </section>
        </>
    );
}
