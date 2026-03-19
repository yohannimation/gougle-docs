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
        <Card
            className="
                relative
                mx-auto
                w-full max-w-sm
                border-blue-200
                gap-1
                md:hover:-translate-y-1
                shadow-none md:hover:shadow-md
                duration-200
            "
        >
            <img
                src={imgUrl}
                alt={`Feature image : ${name}`}
                className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
            />
            <CardHeader>
                <CardTitle className="overflow-hidden text-ellipsis text-nowrap text-2xl">
                    {name}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
        </Card>
    );
}
