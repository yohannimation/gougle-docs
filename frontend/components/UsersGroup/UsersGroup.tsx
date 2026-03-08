import { useToast } from '@/hooks/useToast';

import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage,
} from '../ui/avatar';

import { UserPlus } from 'lucide-react';

interface User {
    username: string;
    userColor: string;
}

interface UsersGroupProps {
    users?: User[];
}

export default function UsersGroup({ users }: UsersGroupProps) {
    const toast = useToast();

    if (!users) return;

    const copyCurrentUrl = () => {
        navigator.clipboard.writeText(window.location.href);

        toast.info('URL copied in clipboard');
    };

    return (
        <AvatarGroup>
            {users?.slice(0, 3).map((user, index) => (
                <Avatar key={index}>
                    <AvatarImage src="" alt="" />
                    <AvatarFallback
                        style={{ backgroundColor: user.userColor }}
                        className="color-neutral-950 font-bold"
                    >
                        {user.username.slice(0, 2)}
                    </AvatarFallback>
                </Avatar>
            ))}
            {users.length > 3 && (
                <AvatarGroupCount className="me-1">
                    +{users.length - 3}
                </AvatarGroupCount>
            )}
            <AvatarGroupCount
                onClick={copyCurrentUrl}
                className="bg-blue-100 border border-blue-200 cursor-pointer"
                title="Invite user"
            >
                <UserPlus />
            </AvatarGroupCount>
        </AvatarGroup>
    );
}
