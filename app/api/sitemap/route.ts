import { NextResponse } from "next/server";

const tags = ["conteudo-adulto", 
  "hentai", 
  "amador", 
  "plataforma-de-afiliados",  
  "criadores-de-conteúdo", 
  "live-ao-vivo", "acompanhantes", 
  "OnlyFans brasileiro", 
  "www.onlyfans.com",   
  "onlyfans",   
  "www.privacy.com",  
  "privacy",  
  "xvideos", 
  "www.xvideos.com", 
  "socaseiras", 
  "www.socadseiras.com.br",  
  "lésbica",
  "milf",
  "cosplay",
  "femdom",
  "dominição",
  "inversão-de-papéis",
  "lcasal bi",
  "lésbica",
  "sexo",
  "putaria",
  "swing",
  "intimidades-caseiras",
  "troca de casais"];
const sorts = ["views", "recent", "popular"];

export async function GET() {
  const baseUrl = "https://www.indecent.top";

  const sitemapUrls = sorts
    .flatMap((sort) =>
      tags.map((tag) => `${baseUrl}/tags/${sort}/${tag}`)
    )
    .map((url) => `<url><loc>${url}</loc></url>`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemapUrls.join("")}
    </urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
