import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const placeId = req.nextUrl.searchParams.get("placeId")?.trim();
  if (!placeId) {
    return NextResponse.json({ error: "Missing placeId" }, { status: 400 });
  }

  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "GOOGLE_MAPS_API_KEY is not configured in .env.local" },
      { status: 500 }
    );
  }

  const url = new URL(
    "https://maps.googleapis.com/maps/api/place/details/json"
  );
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "geometry,address_components");
  url.searchParams.set("key", key);

  const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
  const data = await res.json();

  if (data.status !== "OK") {
    console.error("[geocode] Google API error:", data.status);
    return NextResponse.json({ error: data.status }, { status: 400 });
  }

  const result = data.result;
  const lat: number | null = result.geometry?.location?.lat ?? null;
  const lng: number | null = result.geometry?.location?.lng ?? null;

  type Component = { long_name: string; short_name: string; types: string[] };
  const components: Component[] = result.address_components ?? [];

  const city =
    components.find((c) => c.types.includes("locality"))?.long_name ?? "";
  const state =
    components.find((c) =>
      c.types.includes("administrative_area_level_1")
    )?.short_name ?? "";

  return NextResponse.json({ lat, lng, city, state });
}
