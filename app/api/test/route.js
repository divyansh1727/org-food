import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  await getDatabase(); // This initializes the database connection
  return NextResponse.json({ message: "DB connected!" });
}
