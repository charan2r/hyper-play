import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { TOAST_EVENT } from "../../utils/toast";

export default function ToastHost() {
  const [toast, setToast] = useState(null);

  const hide = useCallback(() => setToast(null), []);

  useEffect(() => {
    const onToast = (e) => {
      const { message, variant } = e.detail || {};
      if (!message) return;
      setToast({ message, variant: variant || "success" });
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(hide, 3200);
    return () => clearTimeout(t);
  }, [toast, hide]);

  if (!toast) return null;

  const isError = toast.variant === "error";

  return (
    <div
      className="pointer-events-none fixed top-20 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-md -translate-x-1/2"
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-auto opacity-0 animate-[toast-in_0.3s_ease-out_forwards]">
        <div
          className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 shadow-lg ${
            isError
              ? "border-red-200 bg-red-50 text-red-900"
              : "border-green-200 bg-white text-gray-900"
          }`}
        >
          {isError ? (
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          ) : (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
          )}
          <p className="text-sm font-medium leading-snug">{toast.message}</p>
        </div>
      </div>
      <style>{`
        @keyframes toast-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
