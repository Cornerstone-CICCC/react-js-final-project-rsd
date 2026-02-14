"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function processPurchase() {
      const sessionId = params.get("session_id");
      if (!sessionId) return;

      const res = await fetch(`/api/checkout/session?session_id=${sessionId}`);
      const session = await res.json();

      console.log("🔥 Session:", session);

      const userId = session.metadata.userId;
      const cartItems = JSON.parse(session.metadata.cartItems);

      await fetch("/api/user/add-games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, cartItems }),
      });

      router.push("/library");
    }

    processPurchase();
  }, []);

  return (
    <div className="text-white p-20">
      <h1 className="text-3xl font-bold">Processing your purchase...</h1>
    </div>
  );
}
