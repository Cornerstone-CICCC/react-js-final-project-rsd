import { connectDB } from "@/app/api/lib/mongodb";
import { User } from "@/app/api/models/User";
import { Game } from "@/app/api/models/Game";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await connectDB();

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

   const validIds = user.ownedGames.filter((item) =>  typeof item === "string" && item.trim() !== ""); 
   const games = await Game.find({ _id: { $in: validIds } });


    return NextResponse.json(games, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
