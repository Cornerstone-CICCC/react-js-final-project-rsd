"use client";

import Image from "next/image";
import { useCart } from "@/app/store/cart";
import { X, Trash2 } from "lucide-react";
import Link from "next/link";
export default function Cart() {
  const { items, isOpen, close, increase, decrease, remove } = useCart();

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  
  return (
    <>
      {isOpen && (
        <div
          onClick={close}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        />
      )}

      <div
        className={`
          fixed top-0 right-0 h-full w-[380px] bg-zinc-900 border-l border-zinc-800 
          z-50 p-6 flex flex-col transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button onClick={close}>
            <X className="text-zinc-400 hover:text-white transition" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6">
          {items.length === 0 && (
            <p className="text-zinc-500">Your cart is empty.</p>
          )}

          {items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-zinc-700">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="text-green-400 font-bold">${item.price}</p>

                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => decrease(item.id)}
                    className="px-2 py-1 bg-zinc-800 rounded hover:bg-zinc-700 text-white"
                  >
                    -
                  </button>

                  <span className="text-white">{item.quantity}</span>

                  <button
                    onClick={() => increase(item.id)}
                    className="px-2 py-1 bg-zinc-800 rounded hover:bg-zinc-700 text-white"
                  >
                    +
                  </button>

                  <button
                    onClick={() => remove(item.id)}
                    className="ml-auto text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2 text-zinc-300">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-white font-semibold">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Total</span>
            <span className="text-green-400 font-bold">
              ${subtotal.toFixed(2)}
            </span>
          </div>
        </div>

        <button
            onClick={() => {
                close();
                alert("Proceeding to checkout...");}}
            className="w-full mt-4 bg-green-500 text-black font-semibold py-3 rounded-lg hover:bg-green-400 transition"
            >
            <Link href="/checkout" className="block w-full h-full text-center">
                Checkout Now →
            </Link>

        </button>



          <p className="text-xs text-zinc-500 mt-2 text-center">
            Secure checkout powered by GameHub Pay
          </p>
        </div>
    </>
  );
}
