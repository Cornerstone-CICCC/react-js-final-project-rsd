import { connectDB } from "../lib/mongodb";
import { User } from "../models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find();
    return NextResponse.json(users);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userInfo } = await req.json();
    if (!userInfo) {
      return NextResponse.json(
        { error: "userInfomation cannot be empty" },
        { status: 400 },
      );
    }
    await connectDB();

    const hashedPassword = await bcrypt.hash(userInfo.password, 10);

    const user = await User.create({ ...userInfo, password: hashedPassword });
    return NextResponse.json(user, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
