import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { FormikProps } from 'formik';
import { DocumentUpdateInput } from '@/lib/api/documents';

import { Pencil } from 'lucide-react';

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
                            className="invisible whitespace-pre p-1.5 px-2.75 h-9"
                            style={{
                                fontSize: 'clamp(1.2rem, 1.4vw, 1.4rem)',
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
                                fontSize: 'clamp(1.1rem, 1.3vw, 1.3rem)',
                            }}
                            className="
                                absolute inset-0 w-full
                                overflow-hidden text-ellipsis

                                h-9 p-1.5 px-2.5 font-semibold

                                border-transparent
                                shadow-none
                                bg-transparent
                                rounded-xl

                                hover:border-input
                                hover:border-blue-200

                                aria-invalid:border-destructive

                                transition-all duration-200
                            "
                        />
                    </div>
                    <Pencil className="size-5 stroke-zinc-500 sm:stroke-transparent group-hover:stroke-zinc-500" />
                </FieldLabel>
            </Field>
        </form>
    );
}
