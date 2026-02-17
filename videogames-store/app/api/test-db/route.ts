import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/app/api/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    const dbState = mongoose.connection.readyState;

    const states: { [key: number]: string } = {
      0: "Disconnected ",
      1: "Connected ",
      2: "Connecting ",
      3: "Disconnecting ",
    };

    return NextResponse.json(
      {
        message: states[dbState],
        status: dbState,
        database: mongoose.connection.db?.databaseName,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "DB error!",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
