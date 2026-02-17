import { connectDB } from "@/app/api/lib/mongodb";
import { Game } from "../models/Game";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/lib/requireAdmin";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const sort = searchParams.get("sort");
    const trending = searchParams.get("trending");

    const filter: Record<string, unknown> = {};
    if (trending === "true") filter.isTrending = true;

    const sortObj: Record<string, 1 | -1> =
      sort === "releaseDate"
        ? { releaseDate: -1, createdAt: -1 }
        : { createdAt: -1 };

    const games = await Game.find(filter).sort(sortObj);
    return NextResponse.json(games);
  } catch (err: any) {
    console.error("GET /api/games error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) {
      return NextResponse.json({ error: "Forbidden" }, { status: auth.status });
    }

    await connectDB();

    const body = await req.json();
    const gameInfo = body?.gameInfo;

    if (!gameInfo) {
      return NextResponse.json({ error: "gameInfo is required" }, { status: 400 });
    }

    const safeId =
      gameInfo.id && String(gameInfo.id).trim() !== ""
        ? gameInfo.id
        : String(Date.now());

    const payload = {
      ...gameInfo,
      id: safeId,
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
