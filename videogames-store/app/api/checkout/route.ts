import { connectDB } from "@/app/api/lib/mongodb";
import { User } from "../models/User";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const { userId, cartItems } = await req.json();

    const cartItemsForStripe = cartItems.map((item: any) => ({
      _id: item._id, 
      title: item.title,
      price: item.price,
      quantity: item.quantity,
    }));

    const line_items = cartItems.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.title },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/cart`,

      metadata: { 
        userId, 
        cartItems: JSON.stringify(cartItemsForStripe),
      },
    });

    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error("❌ Error en /api/checkout:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
