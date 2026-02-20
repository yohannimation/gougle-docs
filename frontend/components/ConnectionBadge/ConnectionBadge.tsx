import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';

interface ConnectionBadgeProps {
    status: 'connecting' | 'connected' | 'disconnected' | 'error';
}

export default function ConnectionBadge({ status }: ConnectionBadgeProps) {
    switch (status) {
        case 'connecting':
            return (
                <Badge variant="secondary">
                    <Spinner />
                    Connecting
                </Badge>
            );

        case 'connected':
            return (
                <Badge variant="valid">
                    <span className="block size-1.75 bg-green-700 rounded-full"></span>
                    Online
                </Badge>
            );

        case 'disconnected':
        case 'error':
            return (
                <Badge
                    variant="destructive"
                    className="relative overflow-visible"
                >
                    <Spinner className="stroke-red-700 stroke-3" />
                    Offline
                    <span className="absolute inset-x-2 inset-y-0 block bg-red-200 rounded-full -z-1 animate-ping"></span>
                </Badge>
            );
    }
}
