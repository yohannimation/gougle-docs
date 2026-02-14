import { Spinner } from '@/components/ui/spinner';

export default function Loader() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Spinner className="size-8" />
            <p className="text-sm text-gray-500">Loading...</p>
        </div>
    );
}
