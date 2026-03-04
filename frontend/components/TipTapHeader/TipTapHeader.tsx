import Link from 'next/link';

import { Button } from '@/components/ui/button';

import ConnectionBadge from '@/components/ConnectionBadge/ConnectionBadge';
import FormDocumentNameUpdate from '@/components/Forms/FormDocumentNameUpdate/FormDocumentNameUpdate';
import UsersGroup from '@/components/UsersGroup/UsersGroup';

import { ArrowLeft } from 'lucide-react';

import { FormikProps } from 'formik';
import { DocumentUpdateInput } from '@/lib/api/documents';

interface TipTapHeaderProps {
    formik: FormikProps<DocumentUpdateInput>;
    connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
    users: User[];
}

interface User {
    username: string;
    userColor: string;
}

export default function TipTapHeader({
    formik,
    connectionStatus,
    users,
}: TipTapHeaderProps) {
    return (
        <>
            <div className="group flex items-center justify-between gap-3 mb-3 mb-2">
                <div className="flex items-center gap-5">
                    <Link href="/docs">
                        <Button>
                            <ArrowLeft />{' '}
                            <span className="hidden sm:block">Back</span>
                        </Button>
                    </Link>
                    <FormDocumentNameUpdate formik={formik} />
                </div>
                <div className="flex items-center gap-3">
                    <ConnectionBadge status={connectionStatus} />
                    <UsersGroup users={users} />
                </div>
            </div>
        </>
    );
}
