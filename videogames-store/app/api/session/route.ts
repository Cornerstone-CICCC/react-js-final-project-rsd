import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user-login")?.value;

  if (!userId) {
    return NextResponse.json({ logged: false });
  }

  return NextResponse.json({ logged: true, userId });
}
