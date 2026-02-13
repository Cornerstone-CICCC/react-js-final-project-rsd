"use client";
import { useEffect } from "react";
import { useCart } from "@/app/store/cart";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    useCart.getState().clear();

    setTimeout(() => {
      router.push("/library");
    }, 3000);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-green-400 mb-2">
        Payment successful!
      </h1>
      <p className="text-zinc-400">
        Redirecting you to your library in a moment...
      </p>

      <div className="mt-4 w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
