import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, company, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const apiKey = process.env.MAILCHIMP_API_KEY!;
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID!;
    const server = process.env.MAILCHIMP_SERVER_PREFIX!;

    const auth = Buffer.from(`anystring:${apiKey}`).toString("base64");

    const res = await fetch(
      `https://${server}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: name,
            COMPANY: company,
          },
        }),
      }
    );

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (res.ok || data.title === "Member Exists") {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: data.detail ?? "Something went wrong. Please try again." },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
