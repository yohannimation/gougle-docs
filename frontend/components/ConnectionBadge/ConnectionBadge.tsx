import { Badge } from '@/components/ui/badge';

interface ConnectionBadgeProps {
    status: 'connecting' | 'connected' | 'disconnected' | 'error';
}

export default function ConnectionBadge({ status }: ConnectionBadgeProps) {
    switch (status) {
        case 'connecting':
            return (
                <Badge variant="secondary">
                    <span className="block size-1.5 bg-slate-500 rounded-full"></span>
                    Connecting
                </Badge>
            );

        case 'connected':
            return (
                <Badge variant="valid">
                    <span className="block size-1.5 bg-green-700 rounded-full"></span>
                    Connected
                </Badge>
            );

        case 'disconnected':
            return (
                <Badge variant="destructive">
                    <span className="block size-1.5 bg-red-700 rounded-full"></span>
                    Disconnected
                </Badge>
            );

        case 'error':
            return (
                <Badge variant="destructive">
                    <span className="block size-1.5 bg-red-700 rounded-full"></span>
                    Error
                </Badge>
            );
    }
}
