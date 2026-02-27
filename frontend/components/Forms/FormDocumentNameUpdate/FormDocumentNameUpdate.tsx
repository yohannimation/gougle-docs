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
                <FieldLabel
                    htmlFor="name"
                    className="flex gap-2 cursor-pointer"
                >
                    <div className="relative inline-grid max-w-30 md:max-w-80">
                        {/* Mirror */}
                        <span
                            className="invisible whitespace-pre px-3.5 py-1"
                            style={{
                                fontSize: 'clamp(1.87rem, 2.64vw, 2.2rem)',
                            }}
                        >
                            {formik.values.name || 'Document name'}
                        </span>

                        <Input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="off"
                            value={formik.values.name ?? ''}
                            onChange={formik.handleChange}
                            aria-invalid={!!formik.errors.name || undefined}
                            style={{
                                fontSize: 'clamp(1.87rem, 2.64vw, 2.2rem)',
                            }}
                            className="
                                absolute inset-0 w-full

                                h-12 px-0 font-semibold

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
                    </div>
                    <Pen className="size-4 stroke-zinc-500" />
                </FieldLabel>
                <FieldDescription>{formik.errors.name}</FieldDescription>
            </Field>
        </form>
    );
}
