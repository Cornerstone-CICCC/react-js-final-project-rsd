import { connectDB } from "@/app/api/lib/mongodb";
import { Game } from "../../models/Game";
import { NextRequest, NextResponse } from "next/server";

/* ===============================
   GET /api/games/:id
   Get single game by ID
================================ */
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

    return NextResponse.json(game, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* ===============================
   PUT /api/games/:id
   Update game by ID
================================ */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;
    const { gameInfo } = await req.json();

    if (!gameInfo) {
      return NextResponse.json(
        { error: "gameInfo is required" },
        { status: 400 },
      );
    }

    const game = await Game.findById(id);

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    Object.assign(game, gameInfo);
    await game.save();

    return NextResponse.json(game, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* ===============================
   DELETE /api/games/:id
   Delete game by ID
================================ */
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    const deleted = await Game.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, deletedId: id },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
