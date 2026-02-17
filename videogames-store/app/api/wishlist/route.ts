import { connectDB } from "@/app/api/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { User } from "../models/User";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const user = await User.findById(userId).populate("whishlist");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.whishlist);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const { userId, gameId } = await req.json();

    if (!userId || !gameId) {
      return NextResponse.json({ error: "userId and gameId required" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { whishlist: gameId } },
      { new: true }
    ).populate("whishlist");

    return NextResponse.json(updatedUser?.whishlist);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const { userId, gameId } = await req.json();

    if (!userId || !gameId) {
      return NextResponse.json({ error: "userId and gameId required" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { whishlist: gameId } },
      { new: true }
    ).populate("whishlist");

    return NextResponse.json(updatedUser?.whishlist);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
