import { connectDB } from "@/app/api/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { User } from "../models/User";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    await connectDB();

    const { userId } = await params;

    //const wishlist = await User.findById(userId)
    const user = await User.findById(userId).populate("whishlist");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user.whishlist);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { wishInfo } = await req.json();
    if (wishInfo) {
      return NextResponse.json(
        { error: "wishInfo cannot be empty" },
        { status: 400 },
      );
    }
    await connectDB();
    const wish = await User.create({ ...wishInfo });
    return NextResponse.json(wish, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const { gameId } = await req.json();

    await connectDB();
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { whishlist: gameId } },
      { new: true },
    ).populate("whishlist");

    return NextResponse.json(updatedUser, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const { gameId } = await req.json();

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { whishlist: gameId } },
      { new: true },
    ).populate("whishlist");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser.whishlist, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
