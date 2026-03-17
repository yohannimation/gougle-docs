'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

import FeatureCard from '@/components/Home/FeatureCard/FeatureCard';

import { ArrowRight } from 'lucide-react';

import type { FeatureInterface } from '@/interface/Feature.interface';

export default function Home() {
    const features: FeatureInterface[] = [
        {
            sourceUrl: 'https://localhost:3000',
            name: 'Collaboration',
            description:
                'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum ',
        },
        {
            sourceUrl: 'https://localhost:3000',
            name: 'Text style',
            description: 'Titre, bold, underline',
        },
        {
            sourceUrl: 'https://localhost:3000',
            name: 'List',
            description:
                'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
        },
        {
            sourceUrl: 'https://localhost:3000',
            name: 'Table',
            description:
                'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
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
                    <h1>Rédigez ensemble</h1>
                    <p>
                        <strong>Gougle Docs</strong> est un éditeur collaboratif
                        en temps réel.
                        <br />
                        Vos modifications apparaissent instantanément chez vos
                        collaborateurs sans rechargement et sans conflit.
                    </p>
                    <Link href="/docs" className="w-fit" title="New document">
                        <Button variant="outline" className="w-fit hover:gap-3">
                            Découvrir <ArrowRight />
                        </Button>
                    </Link>
                </div>
                <div className="bg-white rounded-lg"></div>
            </section>
            <section className="py-6 flex flex-col gap-3">
                <h2>Quelques fonctionnalités</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            sourceUrl={feature.sourceUrl}
                            name={feature.name}
                            description={feature.description}
                        />
                    ))}
                </ul>
            </section>
        </>
    );
}
