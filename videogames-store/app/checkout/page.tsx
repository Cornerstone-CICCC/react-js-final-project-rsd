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
    0
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

  for (const item of items) {
    await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id,
        gameId: item.id,
        price: item.price,
      }),
    });
  }

  useCart.getState().clear();
  router.push("/library");
};




  return (
    <div className="min-h-screen bg-black text-white px-10 py-20">
      <div className="flex items-center justify-center gap-10 mb-16 text-zinc-500">
        <span className="text-zinc-600">Cart</span>
        <div className="w-10 h-[2px] bg-zinc-700" />
        <span className="text-green-400 font-semibold">Checkout</span>
        <div className="w-10 h-[2px] bg-zinc-700" />
        <span className="text-zinc-600">Confirmation</span>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        <div className="lg:col-span-2 space-y-12">

          <Section title="Contact Information">
            <Input label="Email Address" placeholder="name@example.com" />
          </Section>

          <Section title="Billing Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Name" placeholder="John Doe" />
              <Input label="Address" placeholder="123 Gaming Street" />
              <Input label="City" placeholder="Los Angeles" />
              <Input label="State/Province" placeholder="CA" />
              <Input label="Postal/Zip Code" placeholder="90001" />
            </div>
          </Section>

          <Section title="Payment Method">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">

                {/* CREDIT CARD */}
                <button
                  onClick={() => setMethod("credit")}
                  className={`
                    flex items-center gap-3 p-4 rounded-xl border transition
                    ${method === "credit" 
                      ? "border-green-400 text-green-400 bg-green-400/10" 
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-500"}
                  `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M2 10h20" />
                  </svg>

                  <span className="font-semibold">Credit Card</span>
                </button>

                <button
                  onClick={() => setMethod("debit")}
                  className={`
                    flex items-center gap-3 p-4 rounded-xl border transition
                    ${method === "debit" 
                      ? "border-green-400 text-green-400 bg-green-400/10" 
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-500"}
                  `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M2 10h20" />
                  </svg>

                  <span className="font-semibold">Debit Card</span>
                </button>
              </div>
              <Input label="Card Number" placeholder="0000 0000 0000 0000" />

              <div className="grid grid-cols-2 gap-6">
                <Input label="Expiration Date" placeholder="MM/YY" />
                <Input label="CVC" placeholder="123" />
              </div>

              <Input label="Name on Card" placeholder="JOHN DOE" />

              <div className="flex items-center gap-3 mt-2">
                <input type="checkbox" className="accent-green-500" />
                <span className="text-zinc-400">Save this card for next time</span>
              </div>
            </div>
          </Section>

        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-8 h-fit">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>

          <div className="space-y-4 text-zinc-300">
            {items.map((item) => (
              <SummaryItem
                key={item.id}
                title={item.title}
                quantity={item.quantity}
                image={item.imageImg || "https://placehold.co/400x200/png"}
                price={
                  <span className="text-green-400 font-semibold">
                    ${ (item.price * item.quantity).toFixed(2) }
                  </span>
                }
              />
            ))}
          </div>

          <div className="mt-8 space-y-2 text-zinc-300">
            <TotalRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
            <TotalRow label="Tax" value={`$${tax.toFixed(2)}`} />
            <TotalRow label="Total" value={`$${total.toFixed(2)}`} bold highlight />
          </div>

          <button onClick={handlePlaceOrder} className="w-full mt-8 bg-green-500 text-black font-semibold py-3 rounded-lg hover:bg-green-400 transition">
            PLACE ORDER
          </button>

          <div className="text-center mt-6">
            <a href="/cart" className="text-zinc-400 hover:text-white transition">
              RETURN TO CART
            </a>
          </div>
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
      <h2 className="border-l-4 border-[#3DFF6B] pl-6 text-xl font-bold mb-4">{title}</h2>
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
