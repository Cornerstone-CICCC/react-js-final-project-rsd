import { NextRequest, NextResponse } from "next/server";
import { User } from "../models/User";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // DATABASE CHECKS

  if (!email || email.trim() === "") {
    return NextResponse.json(
      { message: "email is required!" },
      { status: 400 },
    );
  }

  if (!password || password.trim() === "") {
    return NextResponse.json(
      { message: "password is required!" },
      { status: 400 },
    );
  }

  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.json({ status: 200 });

  response.cookies.set({
    name: "user-login",
    value: user._id.toString(),
    httpOnly: true,
    maxAge: 10 * 60,
  });

  return response;
}
