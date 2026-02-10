"use client";

import { useToast } from "@/app/store/toast";
import { useEffect } from "react";

export default function ToastContainer() {
  const { toasts, remove } = useToast();

  useEffect(() => {
    if (toasts.length === 0) return;

    const timer = setTimeout(() => {
      remove(toasts[0].id);
    }, 2500);

    return () => clearTimeout(timer);
  }, [toasts, remove]);

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="
            px-4 py-3 
            bg-green-500 text-black font-semibold 
            rounded-lg shadow-lg 
            animate-slide-in
          "
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
