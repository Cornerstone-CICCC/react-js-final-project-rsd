import { connectDB } from "@/app/api/lib/mongodb";
import { Game } from "../../models/Game";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const game = await Game.findById(id);
    if (!game) return NextResponse.json({ error: "Game not found" }, { status: 404 });

    return NextResponse.json(game, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();
    const gameInfo = body?.gameInfo;

    if (!gameInfo) {
      return NextResponse.json({ error: "gameInfo is required" }, { status: 400 });
    }

    const game = await Game.findById(id);
    if (!game) return NextResponse.json({ error: "Game not found" }, { status: 404 });

    // ✅ Normalize incoming values (date + boolean)
    const normalized = {
      ...gameInfo,

      releaseDate:
        "releaseDate" in gameInfo
          ? gameInfo.releaseDate && String(gameInfo.releaseDate).trim() !== ""
            ? new Date(gameInfo.releaseDate)
            : null
          : undefined,

      isTrending:
        "isTrending" in gameInfo
          ? typeof gameInfo.isTrending === "boolean"
            ? gameInfo.isTrending
            : String(gameInfo.isTrending).toLowerCase() === "true"
          : undefined,
    };

    // Only assign defined keys (avoid overwriting if undefined)
    Object.entries(normalized).forEach(([k, v]) => {
      if (v !== undefined) (game as any)[k] = v;
    });

    await game.save();
    return NextResponse.json(game, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const deleted = await Game.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, deletedId: id }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
