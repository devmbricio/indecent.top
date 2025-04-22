import { NextResponse } from "next/server";

export async function GET() {
  const robotsTxt = `
User-agent: *
Allow: /

Sitemap: https://indecent.top/sitemap.xml
  `;

  return new NextResponse(robotsTxt.trim(), {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
