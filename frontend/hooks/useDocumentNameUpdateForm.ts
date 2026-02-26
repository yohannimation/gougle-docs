import { useFormik } from 'formik';

import * as Yup from 'yup';

const validationSchema = Yup.object({
    name: Yup.string()
        .trim()
        .min(2, 'Must have min 2 characters')
        .max(32, 'Must have max 32 characters')
        .required('Document name is required'),
});

export function useDocumentNameUpdateForm(
    documentName: string,
    updateDocument: (values: any) => Promise<any>,
    onSuccess?: () => void
) {
    return useFormik({
        initialValues: {
            name: documentName,
            isEditable: true,
            content: '',
        },
        enableReinitialize: true,
        validationSchema,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async (values, { resetForm }) => {
            if (documentName === values.name) {
                return;
            }

            try {
                await updateDocument(values);
                onSuccess();
            } catch (err) {
                console.error(err);
            }
        },
    });
}
