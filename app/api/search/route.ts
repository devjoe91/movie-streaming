/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  try {
    const res = await fetch(`https://archive.org/...${encodeURIComponent(query)}`); // your real search URL
    const data: any = await res.json();

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
