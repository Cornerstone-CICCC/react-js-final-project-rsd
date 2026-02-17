import { connectDB } from "@/app/api/lib/mongodb";
import { Game } from "../../models/Game";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/lib/requireAdmin";
import mongoose from "mongoose";

function buildGameQuery(id: string) {
  const isObjectId = mongoose.Types.ObjectId.isValid(id);
  return isObjectId
    ? { $or: [{ _id: id }, { id }] }
    : { id };
}

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const game = await Game.findOne(buildGameQuery(id));
    if (!game) return NextResponse.json({ error: "Game not found" }, { status: 404 });

    return NextResponse.json(game, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/games/[id] error:", error);
    return NextResponse.json(
      { error: error?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) {
      return NextResponse.json({ error: "Forbidden" }, { status: auth.status });
    }

    await connectDB();

    const { id } = await params;
    const body = await req.json();
    const gameInfo = body?.gameInfo;

    if (!gameInfo) {
      return NextResponse.json({ error: "gameInfo is required" }, { status: 400 });
    }

    const {
      _id: _ignoreMongoId,
      id: _ignoreCustomId,
      __v: _ignoreV,
      createdAt: _ignoreCreatedAt,
      updatedAt: _ignoreUpdatedAt,
      ...safe
    } = gameInfo as Record<string, any>;

    const update: Record<string, any> = { ...safe };

    if ("releaseDate" in gameInfo) {
      const rd = gameInfo.releaseDate;
      update.releaseDate = rd && String(rd).trim() !== "" ? new Date(rd) : null;
    }

    if ("isTrending" in gameInfo) {
      const t = gameInfo.isTrending;
      update.isTrending = typeof t === "boolean" ? t : String(t).toLowerCase() === "true";
    }

    Object.keys(update).forEach((k) => {
      const v = update[k];
      if (v === undefined) delete update[k];
      if (typeof v === "string" && v.trim() === "") delete update[k];
    });

    const updated = await Game.findOneAndUpdate(buildGameQuery(id), update, {
      new: true,
      runValidators: false,
    });

    if (!updated) return NextResponse.json({ error: "Game not found" }, { status: 404 });

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/games/[id] error:", error);
    return NextResponse.json(
      { error: error?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) {
      return NextResponse.json({ error: "Forbidden" }, { status: auth.status });
    }

    await connectDB();

    const { id } = await params;
    const deleted = await Game.findOneAndDelete(buildGameQuery(id));

    if (!deleted) return NextResponse.json({ error: "Game not found" }, { status: 404 });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/games/[id] error:", error);
    return NextResponse.json(
      { error: error?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}
