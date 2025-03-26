
import { toast } from "sonner";

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
  duration?: number;
}

export function useToast() {
  const showToast = ({
    title,
    description,
    variant = "default",
    action,
    duration,
  }: ToastOptions) => {
    const options: any = {
      description,
      action,
      duration,
    };

    if (variant === "destructive") {
      return toast.error(title, options);
    }

    return toast(title, options);
  };

  return {
    toast: showToast,
  };
}

export { toast };
