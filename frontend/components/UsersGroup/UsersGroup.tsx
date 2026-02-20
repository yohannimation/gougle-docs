import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage,
} from '../ui/avatar';

interface User {
    username: string;
    userColor: string;
}

interface UsersGroupProps {
    users?: User[];
}

export default function UsersGroup({ users }: UsersGroupProps) {
    if (!users) return;

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
                <AvatarGroupCount>{users.length}</AvatarGroupCount>
            )}
        </AvatarGroup>
    );
}
