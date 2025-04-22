import { getAllLocations, fetchAllPosts } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://indecent.top";

  try {
    // Busca todas as localidades
    const locations = await getAllLocations();

    // Gera URLs para as rotas dinâmicas de localidades
    const locationUrls = locations.map(
      ({ country, city }) => `
        <url>
          <loc>${baseUrl}/acompanhantes/${country}/${city}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <priority>0.8</priority>
        </url>
      `
    );

    // Rotas fixas e principais do site
    const fixedUrls = `
      <url>
        <loc>${baseUrl}/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>${baseUrl}/painel</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>0.9</priority>
      </url>
    `;

    // Rotas dinâmicas dos posts no painel
    const postUrls = await generatePostUrls(baseUrl);

    // Combina todas as URLs
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${fixedUrls}
  ${locationUrls.join("\n")}
  ${postUrls}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("Erro ao gerar o sitemap:", error);
    return new NextResponse(null, { status: 500 });
  }
}

// Função para gerar URLs de posts dinamicamente
async function generatePostUrls(baseUrl: string): Promise<string> {
  const posts = await fetchAllPosts(); // Busca todos os posts
  return posts
    .map(
      (post) => `
      <url>
        <loc>${baseUrl}/painel/profile/posts/${post.user.id}</loc>
        <lastmod>${new Date(post.updatedAt).toISOString()}</lastmod>
        <priority>0.7</priority>
      </url>
    `
    )
    .join("\n");
}
