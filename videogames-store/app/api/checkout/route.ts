import { connectDB } from "@/app/api/lib/mongodb";
import { User } from "../models/User";
import { Order } from "../models/Order";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId, gameId, price } = await req.json();

    const newOrder = await Order.create({
      userId,
      gameId,
      priceAtPurchase: price,
      status: "completed",
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { ownedGames: gameId },
    });

    return NextResponse.json(
      { message: "Purchase successful", order: newOrder },
      { status: 201 },
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
