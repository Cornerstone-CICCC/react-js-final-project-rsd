import { connectDB } from "@/app/api/lib/mongodb";
import { Game } from "../models/Game";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  // sort=createdAt | releaseDate
  const sort = searchParams.get("sort");

  // trending=true (optional filter)
  const trending = searchParams.get("trending");

  const filter: Record<string, unknown> = {};
  if (trending === "true") filter.isTrending = true;

  const sortObj: Record<string, 1 | -1> =
    sort === "releaseDate"
      ? { releaseDate: -1, createdAt: -1 }
      : { createdAt: -1 };

  const games = await Game.find(filter).sort(sortObj);
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

    // ✅ Normalize incoming values (date + boolean)
    const payload = {
      ...gameInfo,

      releaseDate:
        gameInfo.releaseDate && String(gameInfo.releaseDate).trim() !== ""
          ? new Date(gameInfo.releaseDate)
          : null,

      isTrending:
        typeof gameInfo.isTrending === "boolean"
          ? gameInfo.isTrending
          : String(gameInfo.isTrending).toLowerCase() === "true",
    };

    const game = await Game.create(payload);
    return NextResponse.json(game, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/games error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}
