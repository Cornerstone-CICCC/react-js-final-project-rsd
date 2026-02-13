import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/app/api/lib/mongodb";
import { User } from "../models/User";
import { Order } from "../models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature") || "";

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err: any) {
      return new NextResponse(`Webhook Signature Error: ${err.message}`, {
        status: 400,
      });
    }

    if (event.type === "checkout.session.completed") {
      await connectDB();

      const session = event.data.object as any;
      const userId = session.metadata.userId;
      const cartItems = JSON.parse(session.metadata.cartItems);

      const order = await Order.create({
        userId,
        games: cartItems.map((g: any) => g.id),
        totalAmount: session.amount_total / 100,
        status: "completed",
      });

      await User.findByIdAndUpdate(userId, {
        $addToSet: {
          ownedGames: { $each: cartItems.map((g: any) => g.id) },
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
