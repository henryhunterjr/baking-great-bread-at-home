
import { toast } from "sonner";

// Define the toast options interface
export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
  duration?: number;
}

// Create a hook that provides a standardized interface for toast messages
export function useToast() {
  // Create a wrapper around sonner's toast to handle our custom options
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

    // Handle variants
    if (variant === "destructive") {
      return toast.error(title, options);
    }

    return toast(title, options);
  };

  return {
    toast: showToast,
  };
}

// Also export the toast functions directly for use without the hook
export { toast };
