"use client";

import { useState } from "react";


export default function CheckoutPage() {
  const [promo, setPromo] = useState("");

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
              <div className="flex items-center gap-3">
                <input type="radio" defaultChecked className="accent-green-500" />
                <span className="text-zinc-300">Credit Card</span>
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
            <SummaryItem title="Halo Infinite" price="$59" />
            <SummaryItem title="Cyberpunk 2077" price="$39" />
          </div>

          <div className="mt-8">
            <label className="text-zinc-400 text-sm">Promo Code</label>
            <div className="flex mt-2">
              <input
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                placeholder="Enter code"
                className="bg-zinc-800 border border-zinc-700 rounded-l-lg px-3 py-2 w-full focus:outline-none"
              />
              <button className="bg-green-500 text-black px-4 rounded-r-lg font-semibold hover:bg-green-400 transition">
                Apply
              </button>
            </div>
          </div>

          <div className="mt-8 space-y-2 text-zinc-300">
            <TotalRow label="Subtotal" value="$98" />
            <TotalRow label="Tax" value="$2" />
            <TotalRow label="Total" value="$100" />
            <TotalRow label="Discount" value="- $22" highlight />
            <TotalRow label="Final Total" value="$78" bold highlight />
          </div>

          <button className="w-full mt-8 bg-green-500 text-black font-semibold py-3 rounded-lg hover:bg-green-400 transition">
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
      <h2 className="text-xl font-bold mb-4">{title}</h2>
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
  price: string;
};

function SummaryItem({ title, price }: SummaryItemProps) {
  return (
    <div className="flex justify-between">
      <span>{title}</span>
      <span className="text-zinc-100">{price}</span>
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
