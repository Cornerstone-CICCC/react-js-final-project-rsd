import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { connectDB } from "@/app/api/lib/mongodb";
import { User } from "@/app/api/models/User";

function getCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return undefined;
  const parts = cookieHeader.split(";").map((p) => p.trim());
  const found = parts.find((p) => p.startsWith(`${name}=`));
  if (!found) return undefined;
  return decodeURIComponent(found.slice(name.length + 1));
}

export async function GET() {
  const h = await headers();
  const cookieHeader = h.get("cookie");
  const userId = getCookieValue(cookieHeader, "user-login");

  if (!userId) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  await connectDB();
  const user = await User.findById(userId)
    .select("email isAdmin whishlist ownedGames")
    .lean();

  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json(
    {
      user: {
        id: String(user._id),
        email: user.email,
        isAdmin: Boolean(user.isAdmin),
        wishlistCount: Array.isArray(user.whishlist) ? user.whishlist.length : 0,
        ownedCount: Array.isArray(user.ownedGames) ? user.ownedGames.length : 0,
      },
    },
    { status: 200 }
  );
}
