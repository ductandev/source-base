// toastify.tsx
import { Bounce, toast, ToastOptions } from "react-toastify";

const DEFAULT_CONFIG: ToastOptions = {
  position: "top-center",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
};

const createToast = (
  type: "info" | "success" | "warn" | "error" | "default",
  title: string,
  config?: Partial<ToastOptions>,
) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  switch (type) {
    case "info":
      return toast.info(title, finalConfig);
    case "success":
      return toast.success(title, finalConfig);
    case "warn":
      return toast.warn(title, finalConfig);
    case "error":
      return toast.error(title, finalConfig);
    default:
      return toast(title, finalConfig);
  }
};

export const showInfoToast = (title: string, config?: Partial<ToastOptions>) =>
  createToast("info", title, config);

export const showSuccessToast = (
  title: string,
  config?: Partial<ToastOptions>,
) => createToast("success", title, config);

export const showWarningToast = (
  title: string,
  config?: Partial<ToastOptions>,
) => createToast("warn", title, config);

export const showErrorToast = (title: string, config?: Partial<ToastOptions>) =>
  createToast("error", title, config);

export const showDefaultToast = (
  title: string,
  config?: Partial<ToastOptions>,
) => createToast("default", title, config);

//===== ✅ CÁCH DÙNG CLEAN HƠN =====
//
// Override duration
// showSuccessToast("Saved!", { autoClose: 5000 });

// Change position
// showErrorToast("Failed", { position: "bottom-right" });

// Disable auto close
// showWarningToast("Important message", { autoClose: false });

// Multiple overrides
// showInfoToast("Processing...", {
//   autoClose: 3000,
//   position: "top-right",
//   hideProgressBar: true,
// });
