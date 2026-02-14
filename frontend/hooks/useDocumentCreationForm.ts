import { useFormik } from 'formik';

import * as Yup from 'yup';

const validationSchema = Yup.object({
    name: Yup.string()
        .min(2, 'Must have min 2 characters')
        .max(32, 'Must have max 32 characters')
        .required('Document name is required'),
});

export function useDocumentCreationForm(
    createDocument: (values: any) => Promise<any>,
    onSuccess: () => void
) {
    return useFormik({
        initialValues: {
            name: '',
            isEditable: true,
            content: '',
        },
        validationSchema,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async (values, { resetForm }) => {
            try {
                await createDocument(values);
                onSuccess();
                resetForm();
            } catch (err) {
                console.error(err);
            }
        },
    });
}
