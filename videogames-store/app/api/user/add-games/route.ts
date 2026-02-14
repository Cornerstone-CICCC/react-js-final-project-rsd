import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/api/lib/mongodb";
import { User } from "@/app/api/models/User";

export async function POST(req: NextRequest) {
  try {
    const { userId, cartItems } = await req.json();

    await connectDB();

    for (const item of cartItems) {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { ownedGames: item._id },
      });

    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
