import { NextRequest, NextResponse } from "next/server";
import { User } from "../models/User";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || email.trim() === "") {
    return NextResponse.json({ message: "email is required!" }, { status: 400 });
  }

  if (!password || password.trim() === "") {
    return NextResponse.json({ message: "password is required!" }, { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  // Create the response FIRST
  const response = NextResponse.json(
    { success: true, user: { id: user._id, email: user.email } },
    { status: 200 }
  );

  // Set the cookie properly
  response.cookies.set({
    name: "user-login",
    value: user._id.toString(),
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, 
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" ? true : false,
  });

  return response;
}
