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
          fixed top-0 right-0 h-full 
          w-full sm:w-[380px] 
          bg-zinc-900 border-l border-zinc-800 
          z-50 p-4 sm:p-6 flex flex-col 
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg sm:text-xl font-bold">Your Cart</h2>
          <button onClick={close}>
            <X className="text-zinc-400 hover:text-white transition" size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6">
          {items.length === 0 && (
            <p className="text-zinc-500 text-sm sm:text-base">
              Your cart is empty.
            </p>
          )}

          {items.map((item) => (
            <div key={item._id} className="flex gap-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-zinc-700">
                <Image
                  src={item.imageImg || "https://placehold.co/400x200/png"}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-white text-sm sm:text-base">
                  {item.title}
                </h3>
                <p className="text-green-400 font-bold text-sm sm:text-base">
                  ${item.price}
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => decrease(item._id)}
                    className="px-2 py-1 bg-zinc-800 rounded hover:bg-zinc-700 text-white text-sm"
                  >
                    -
                  </button>

                  <span className="text-white text-sm">{item.quantity}</span>

                  <button
                    onClick={() => increase(item._id)}
                    className="px-2 py-1 bg-zinc-800 rounded hover:bg-zinc-700 text-white text-sm"
                  >
                    +
                  </button>

                  <button
                    onClick={() => remove(item._id)}
                    className="ml-auto text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2 text-zinc-300 text-sm sm:text-base">
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

        {/* CHECKOUT BUTTON */}
        <Link
          href="/checkout"
          onClick={close}
          className="w-full mt-4 bg-green-500 text-black font-semibold py-3 rounded-lg hover:bg-green-400 transition text-center block text-sm sm:text-base"
        >
          Checkout Now →
        </Link>

        <p className="text-xs text-zinc-500 mt-2 text-center">
          Secure checkout powered by GameHub Pay
        </p>
      </div>
    </>
  );
}
