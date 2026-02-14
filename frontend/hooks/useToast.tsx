import { toast } from 'sonner';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';

interface ToastOptions {
    title?: string;
    description?: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function useToast() {
    const showToast = (
        type: ToastType,
        message: string,
        options?: ToastOptions
    ) => {
        const { title, description, duration, action } = options || {};

        const toastContent = title ? (
            <div>
                <div className="font-semibold">{title}</div>
                {description && <div className="text-sm">{description}</div>}
            </div>
        ) : (
            message
        );

        const toastOptions = {
            duration: duration || 4000,
            action: action
                ? {
                      label: action.label,
                      onClick: action.onClick,
                  }
                : undefined,
        };

        switch (type) {
            case 'success':
                return toast.success(toastContent, toastOptions);
            case 'error':
                return toast.error(toastContent, toastOptions);
            case 'info':
                return toast.info(toastContent, toastOptions);
            case 'warning':
                return toast.warning(toastContent, toastOptions);
            case 'loading':
                return toast.loading(toastContent, toastOptions);
            default:
                return toast(toastContent, toastOptions);
        }
    };

    return {
        success: (message: string, options?: ToastOptions) =>
            showToast('success', message, options),

        error: (message: string, options?: ToastOptions) =>
            showToast('error', message, options),

        info: (message: string, options?: ToastOptions) =>
            showToast('info', message, options),

        warning: (message: string, options?: ToastOptions) =>
            showToast('warning', message, options),

        loading: (message: string, options?: ToastOptions) =>
            showToast('loading', message, options),

        promise: <T,>(
            promise: Promise<T>,
            messages: {
                loading: string;
                success: string | ((data: T) => string);
                error: string | ((error: any) => string);
            }
        ) => {
            return toast.promise(promise, messages);
        },

        dismiss: (toastId?: string | number) => {
            toast.dismiss(toastId);
        },
    };
}
