import { connectDB } from "@/app/api/lib/mongodb";
import { Game } from "../models/Game";
import { NextRequest, NextResponse } from "next/server";
import { error } from "console";

export async function GET() {
  await connectDB();
  const games = await Game.find();
  return NextResponse.json(games);
}

export async function POST(req: NextRequest) {
  try {
    const { gameInfo } = await req.json();
    if (!gameInfo) {
      return NextResponse.json(
        { error: "game cannot be empty" },
        { status: 400 },
      );
    }
    await connectDB();
    const game = await Game.create({ ...gameInfo });
    return NextResponse.json(game, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
