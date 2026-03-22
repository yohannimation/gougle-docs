import Image from 'next/image';

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import type { FeatureInterface } from '@/interface/Feature.interface';

export default function FeatureCard({
    imgUrl,
    name,
    description,
}: FeatureInterface) {
    return (
        <li>
            <Card
                className="
                    relative
                    mx-auto pt-0
                    w-full max-w-sm
                    border-blue-200
                    gap-1
                    overflow-hidden
                    md:hover:-translate-y-1
                    shadow-none md:hover:shadow-md
                    duration-200
                "
            >
                <div className="relative aspect-[4/3] border-bottom">
                    <video autoPlay muted loop playsInline>
                        <source src={imgUrl} type="video/mp4" />
                    </video>
                </div>
                <CardHeader>
                    <CardTitle className="overflow-hidden text-ellipsis text-nowrap text-2xl">
                        {name}
                    </CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
            </Card>
        </li>
    );
}
