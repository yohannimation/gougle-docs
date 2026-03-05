import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DocumentCardSkeleton() {
    return (
        <Card className="relative mx-auto w-full max-w-sm gap-2">
            <CardHeader>
                <CardTitle>
                    <Skeleton className="h-7 w-2/3" />
                </CardTitle>
            </CardHeader>
            <CardFooter className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Skeleton className="h-9 col-span-2 sm:col-span-1" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
            </CardFooter>
        </Card>
    );
}
