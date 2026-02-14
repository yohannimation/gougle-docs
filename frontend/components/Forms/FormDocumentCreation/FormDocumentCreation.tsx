import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { FormikProps } from 'formik';
import { DocumentCreateInput } from '@/lib/api/documents';

interface FormDocumentCreationProps {
    formik: FormikProps<DocumentCreateInput>;
}

export default function FormDocumentCreation({
    formik,
}: FormDocumentCreationProps) {
    return (
        <form onSubmit={formik.handleSubmit}>
            <Field data-invalid={!!formik.errors.name || undefined}>
                <FieldLabel htmlFor="name">Document name</FieldLabel>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="New document"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    aria-invalid={!!formik.errors.name || undefined}
                />
                <FieldDescription>{formik.errors.name}</FieldDescription>
            </Field>
        </form>
    );
}
