import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    links: {
      0: {
        rel: "http://nodeinfo.diaspora.software/ns/schema/2.1",
        href: `${process.env.WEB_URL}/nodeinfo/2.1`,
      },
      1: {
        rel: "http://nodeinfo.diaspora.software/ns/schema/2.0",
        href: `${process.env.WEB_URL}/nodeinfo/2.0`,
      },
    },
  });
}
