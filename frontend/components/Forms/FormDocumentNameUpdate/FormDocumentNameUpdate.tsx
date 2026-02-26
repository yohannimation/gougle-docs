import { Field, FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { FormikProps } from 'formik';
import { DocumentUpdateInput } from '@/lib/api/documents';

interface FormDocumentCreationProps {
    formik: FormikProps<DocumentUpdateInput>;
}

export default function FormDocumentNameUpdate({
    formik,
}: FormDocumentCreationProps) {
    return (
        <form onBlur={formik.handleSubmit}>
            <Field
                data-invalid={!!formik.errors.name || undefined}
                className="flex gap-1"
            >
                <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder={formik.errors.name ? 'Document name' : ''}
                    autoComplete="off"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    aria-invalid={!!formik.errors.name || undefined}
                    style={{
                        fontSize: 'clamp(1.87rem, 2.64vw, 2.2rem)',
                    }}
                    className="
                        h-13 w-fit px-0 font-semibold
                        overflow-hidden text-ellipsis

                        border-transparent
                        shadow-none
                        bg-transparent

                        hover:border-input
                        hover:px-3
                        focus-visible:px-3
                        focus-visible:border-ring
                        focus-visible:ring-ring/50
                        focus-visible:ring-[3px]

                        aria-invalid:px-3
                        aria-invalid:border-destructive

                        transition-all duration-200
                    "
                />
                <FieldDescription>{formik.errors.name}</FieldDescription>
            </Field>
        </form>
    );
}
