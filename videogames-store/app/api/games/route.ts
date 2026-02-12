import { connectDB } from "@/app/api/lib/mongodb";
import { Game } from "../models/Game";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const games = await Game.find().sort({ createdAt: -1 });
  return NextResponse.json(games);
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const gameInfo = body?.gameInfo;

    if (!gameInfo) {
      return NextResponse.json({ error: "gameInfo is required" }, { status: 400 });
    }

    // Normalize releaseDate to avoid Mongoose CastError
    const payload = {
      ...gameInfo,
      releaseDate: gameInfo.releaseDate
        ? new Date(gameInfo.releaseDate)
        : undefined,
    };

    const game = await Game.create(payload);
    return NextResponse.json(game, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/games error:", err); // <- mira esto en la terminal
    return NextResponse.json(
      { error: err?.message ?? "Internal Server Error" },
      { status: 500 },
    );
  }
}
