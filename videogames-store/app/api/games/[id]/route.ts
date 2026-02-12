import { connectDB } from "@/app/api/lib/mongodb";
import { Game } from "../../models/Game";
import { NextRequest, NextResponse } from "next/server";
import { error } from "console";

// export async function GET() {
//   await connectDB();
//   const games = await Game.find();
//   return NextResponse.json(games);
// }

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    const game = await Game.findById(id);
    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }
    return NextResponse.json(game);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { gameInfo } = await req.json();

    await connectDB();
    const game = await Game.findById(id);

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }
    Object.assign(game, gameInfo);
    await game.save();
    return NextResponse.json(game, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;
    const game = await Game.findByIdAndDelete(id);
    if (!game) {
      return NextResponse.json(game);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
