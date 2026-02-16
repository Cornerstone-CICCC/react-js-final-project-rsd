"use client";

import { useState } from "react";
import { useCart } from "@/app/store/cart";
import { useRouter } from "next/navigation";
import { useLibrary } from "../store/library";
import { useUser } from "@/app/store/user";
import { useToast } from "@/app/store/toast";

export default function CheckoutPage() {
  const items = useCart((s) => s.items);
  const [method, setMethod] = useState<"credit" | "debit">("credit");
  const router = useRouter();
  const addGame = useLibrary((s) => s.addGame);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const tax = subtotal * 0.12;
  const total = subtotal + tax;

  const user = useUser((s) => s.user);
  const showToast = useToast((s) => s.show);

  const handlePlaceOrder = async () => {
    if (!user) {
      showToast("You must be logged in to checkout");
      return;
    }

    const cartItemsForStripe = [];

    for (const item of items) {

      cartItemsForStripe.push({
        _id: item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      });
    }
    console.log("🛒 Cart items:", cartItemsForStripe);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          cartItems: cartItemsForStripe,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
        useCart.getState().clear();
        // router.push("/library");
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Stripe Redirect Error:", error);
      showToast("An error occurred while redirecting to the payment page.");
    }
  };

  return (
  <div className="min-h-screen bg-black text-white px-6 py-20 flex justify-center">
    <div className="w-full max-w-xl bg-zinc-900/60 border border-zinc-800 rounded-2xl p-10">
      <h2 className="text-2xl font-bold mb-8 text-center">Order Summary</h2>

      <div className="space-y-6 text-zinc-300">
        {items.map((item) => (
          <SummaryItem
            key={item._id}
            title={item.title}
            quantity={item.quantity}
            image={item.imageImg || "https://placehold.co/400x200/png"}
            price={
              <span className="text-green-400 font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            }
          />
        ))}
      </div>

      <div className="mt-10 space-y-3 text-zinc-300 text-lg">
        <TotalRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
        <TotalRow label="Tax" value={`$${tax.toFixed(2)}`} />
        <TotalRow
          label="Total"
          value={`$${total.toFixed(2)}`}
          bold
          highlight
        />
      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full mt-10 bg-green-500 text-black font-semibold py-4 rounded-lg hover:bg-green-400 transition text-lg"
      >
        PLACE ORDER
      </button>

      <div className="text-center mt-6">
        <a
          href="/"
          className="text-zinc-400 hover:text-white transition"
        >
          RETURN HOME
        </a>
      </div>
    </div>
  </div>
);

}

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <div>
      <h2 className="border-l-4 border-[#3DFF6B] pl-6 text-xl font-bold mb-4">
        {title}
      </h2>
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
        {children}
      </div>
    </div>
  );
}

type InputProps = {
  label: string;
  placeholder: string;
};

function Input({ label, placeholder }: InputProps) {
  return (
    <div className="flex flex-col">
      <label className="text-zinc-400 text-sm mb-1">{label}</label>
      <input
        placeholder={placeholder}
        className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none"
      />
    </div>
  );
}

type SummaryItemProps = {
  title: string;
  price: React.ReactNode;
  image: string;
  quantity: number;
};

function SummaryItem({ title, price, image, quantity }: SummaryItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-lg overflow-hidden border border-zinc-700">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col">
          <span className="font-semibold text-white">{title}</span>
          <span className="text-zinc-500 text-sm">Qty: {quantity}</span>
        </div>
      </div>

      <span className="text-zinc-100 font-semibold">{price}</span>
    </div>
  );
}

type TotalRowProps = {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
};

function TotalRow({ label, value, bold, highlight }: TotalRowProps) {
  return (
    <div
      className={`flex justify-between ${
        highlight ? "text-green-400" : "text-zinc-300"
      } ${bold ? "font-bold" : ""}`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
