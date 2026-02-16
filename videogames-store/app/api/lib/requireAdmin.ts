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

export async function requireAdmin() {
  const h = await headers();
  const cookieHeader = h.get("cookie");

  const userId = getCookieValue(cookieHeader, "user-login");
  if (!userId) return { ok: false as const, status: 401 as const };

  await connectDB();
  const user = await User.findById(userId).select("isAdmin").lean();

  if (!user || user.isAdmin !== true) {
    return { ok: false as const, status: 403 as const };
  }

  return { ok: true as const, userId };
}
