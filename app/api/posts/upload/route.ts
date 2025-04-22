import { uploadFile, generateFileUrl } from "@/lib/s3-utils";  // Importa a função para upload de arquivo e gerar URL pública
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { fileName, contentType, fileContent } = await req.json();

  // Realiza o upload do arquivo
  await uploadFile(fileName, contentType, fileContent);

  // Após o upload, gera a URL pública
  const fileUrl = generateFileUrl(fileName);

  // Retorna a URL pública do arquivo
  return NextResponse.json({ fileUrl });
}




/*
import { NextResponse } from "next/server";
import { getDownloadUrl } from "@/lib/s3-utils"; // Presumo que você tenha uma função para obter URLs assinadas, como no caso do vídeo.
import prisma from "@/lib/prisma"; // A conexão com o banco de dados Prisma.

// Função GET para buscar posts
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    // Verifica se a requisição é para uma URL assinada de vídeo
    const videoKey = url.searchParams.get("key");
    if (videoKey) {
      try {
        const signedUrl = await getDownloadUrl(videoKey); // Suponho que você tenha um método para obter a URL assinada de um arquivo
        return NextResponse.json({ url: signedUrl });
      } catch (error) {
        console.error("Erro ao gerar URL assinada:", error);
        return NextResponse.json(
          { error: "Erro ao gerar URL assinada" },
          { status: 500 }
        );
      }
    }

    // Caso contrário, retorna os posts
    const limit = parseInt(url.searchParams.get("limit") || "5", 10); // Limite de posts, padrão 5
    const category = url.searchParams.get("category"); // Se você precisar filtrar por categoria

    // Buscando os posts do banco de dados com o Prisma
    const posts = await prisma.post.findMany({
      where: category ? { category } : {}, // Filtro opcional por categoria
      orderBy: { createdAt: "desc" }, // Ordenação por data de criação
      take: limit, // Limita o número de posts retornados
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    return NextResponse.json(
      { error: "Erro ao buscar posts" },
      { status: 500 }
    );
  }
}
*/