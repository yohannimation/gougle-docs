import { useToast } from '@/hooks/useToast';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import FormDocumentCreation from '@/components/Forms/FormDocumentCreation/FormDocumentCreation';

import { FilePlusCorner, Plus } from 'lucide-react';

import { FormikProps } from 'formik';

interface DocumentCreationDialogProps {
    creationDialogOpen: boolean;
    setCreationDialogOpen: (open: boolean) => void;
    formik: FormikProps<any>;
}

const TOAST_SHOWN_KEY = 'right-click-tip-shown';
const EXPIRATION_DAYS = 20;

export default function DocumentCreationDialog({
    creationDialogOpen,
    setCreationDialogOpen,
    formik,
}: DocumentCreationDialogProps) {
    const toast = useToast();

    const openDialog = () => {
        setCreationDialogOpen(true);

        const storedData = localStorage.getItem(TOAST_SHOWN_KEY);
        if (storedData) {
            const { timestamp } = JSON.parse(storedData);
            const daysSince = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);

            if (daysSince < EXPIRATION_DAYS) {
                return;
            }
        }

        toast.info('You can right-click to create new document quickly.', {
            duration: 8000,
        });

        localStorage.setItem(
            TOAST_SHOWN_KEY,
            JSON.stringify({ timestamp: Date.now() })
        );
    };

    return (
        <Dialog open={creationDialogOpen} onOpenChange={setCreationDialogOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button
                            variant="default"
                            size="icon-lg"
                            className="absolute bottom-0 rounded-full size-15 absolute bottom-0 right-0"
                            onClick={(e) => openDialog()}
                        >
                            <FilePlusCorner className="size-8" />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Create new document</p>
                </TooltipContent>
            </Tooltip>

            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create new document</DialogTitle>
                </DialogHeader>
                <FormDocumentCreation formik={formik} />
                <DialogFooter>
                    <Button onClick={() => formik.handleSubmit()}>
                        <Plus /> Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
