'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

import FeatureCard from '@/components/Home/FeatureCard/FeatureCard';

import { ArrowRight } from 'lucide-react';

import type { FeatureInterface } from '@/interface/Feature.interface';
import Slider from '@/components/Home/Slider/Slider';

export default function Home() {
    const features: FeatureInterface[] = [
        {
            sourceUrl: 'https://localhost:3000',
            name: 'Collaborez',
            description:
                "Chaque frappe est synchronisée en quelques millisecondes. Plusieurs personnes peuvent modifier le même document au même moment sans écraser le travail de l'autre",
        },
        {
            sourceUrl: 'https://localhost:3000',
            name: 'Formatez',
            description:
                "Une expérience d'écriture et de lecture fluide : titres, gras, italique, surlignement... Tout ce dont vous avez besoin, rien de superflu.",
        },
        {
            sourceUrl: 'https://localhost:3000',
            name: 'Structurez',
            description:
                'Ajoutez un tableau en deux clics, ajustez les colonnes, ajoutez des lignes, remplissez les cellules, fusionnez des cellules, ajoutez ou supprimez des lignes à la volée',
        },
        {
            sourceUrl: 'https://localhost:3000',
            name: 'Listez',
            description:
                "Listes à puces, listes numérotées, cases à cocher... Organisez vos notes, vos comptes-rendus ou vos to-do lists sans quitter l'éditeur.",
        },
    ];

    const usage: FeatureInterface[] = [
        {
            name: 'Créez',
            description:
                'Deux clics suffisent. Votre doc est prêt en une seconde.',
            sourceUrl: 'url',
        },
        {
            name: 'Partagez',
            description:
                "Envoyez l'URL à vos collaborateurs. Pas de compte requis pour rejoindre.",
            sourceUrl: 'url',
        },
        {
            name: 'Editez',
            description:
                'Modifiez en temps réel. Les changements se synchronisent instantanément.',
            sourceUrl: 'url',
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
            <section className="py-6 flex flex-col gap-3">
                <h2>Simple à utiliser</h2>
                <Slider items={usage} />
            </section>
        </>
    );
}
