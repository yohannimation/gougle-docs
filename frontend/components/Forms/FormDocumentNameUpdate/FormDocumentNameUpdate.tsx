import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { FormikProps } from 'formik';
import { DocumentUpdateInput } from '@/lib/api/documents';

import { Pen } from 'lucide-react';

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
                <div className="flex gap-2 max-w-70">
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
                        h-11 px-0 font-semibold
                        overflow-hidden text-ellipsis

                        border-transparent
                        shadow-none
                        bg-transparent

                        hover:border-input
                        hover:px-3
                        hover:py-1
                        hover:h-13
                        focus-visible:px-3
                        focus-visible:py-1
                        focus-visible:h-13
                        focus-visible:border-ring
                        focus-visible:ring-ring/50
                        focus-visible:ring-[3px]

                        aria-invalid:px-3
                        aria-invalid:border-destructive

                        transition-all duration-200
                    "
                    />
                    <FieldLabel htmlFor="name">
                        <Pen className="size-4 stroke-zinc-500" />
                    </FieldLabel>
                </div>
                <FieldDescription>{formik.errors.name}</FieldDescription>
            </Field>
        </form>
    );
}
