/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://archive.org/..."); // your real URL here
    const data: any = await res.json();

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load popular movies" }, { status: 500 });
  }
}
