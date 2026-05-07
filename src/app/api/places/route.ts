import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ predictions: [] });
  }

  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "GOOGLE_MAPS_API_KEY is not configured in .env.local" },
      { status: 500 }
    );
  }

  const url = new URL(
    "https://maps.googleapis.com/maps/api/place/autocomplete/json"
  );
  url.searchParams.set("input", q);
  url.searchParams.set("types", "locality");
  url.searchParams.set("components", "country:us");
  url.searchParams.set("language", "en");
  url.searchParams.set("key", key);

  const res = await fetch(url.toString(), { next: { revalidate: 0 } });
  const data = await res.json();

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    console.error("[places] Google API error:", data.status, data.error_message);
    return NextResponse.json({
      predictions: [],
      googleStatus: data.status,
      googleError: data.error_message ?? null,
      raw: data,
    });
  }

  return NextResponse.json({ predictions: data.predictions ?? [] });
}