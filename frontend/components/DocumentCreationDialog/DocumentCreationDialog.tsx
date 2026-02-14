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

export default function DocumentCreationDialog({
    creationDialogOpen,
    setCreationDialogOpen,
    formik,
}: DocumentCreationDialogProps) {
    return (
        <Dialog open={creationDialogOpen} onOpenChange={setCreationDialogOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button
                            variant="default"
                            size="icon-lg"
                            className="rounded-full size-15 absolute bottom-0 right-0"
                            onClick={(e) => setCreationDialogOpen(true)}
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
