// api/posts/save/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getDownloadUrl } from "@/lib/s3-utils"; // Função para gerar links assinados de download

export async function POST(req: Request) {
  try {
    const { caption, fileUrls, category, userId } = await req.json();

    if (!fileUrls || fileUrls.length === 0) {
      return NextResponse.json(
        { error: "Pelo menos uma imagem é obrigatória." },
        { status: 400 }
      );
    }

    // Corrigir URLs antes de salvar no banco
    const validUrls = await Promise.all(
      fileUrls.map(async (url: string) => {
        if (url.startsWith("s3://")) {
          const fileName = url.split("/").pop();
          return await getDownloadUrl(fileName || ""); // Gerar a URL assinada de download
        }
        return url;
      })
    );

    const post = await prisma.post.create({
      data: {
        caption,
        fileUrls: validUrls, // Salvar as URLs completas no banco
        category,
        tags: ["conteudo-adulto", 
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
          "troca de casais"],// Adicione tags ao post
        userId,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Erro ao salvar post:", error);
    return NextResponse.json({ error: "Erro ao salvar post." }, { status: 500 });
  }
}


/*
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function generateFileUrl(fileName: string): string {
  const bucketName = process.env.AWS_BUCKET_NAME || "indecent.top";
  const AWS_REGION = process.env.AWS_REGION || "us-east-2";
  return `https://s3.${AWS_REGION}.amazonaws.com/${bucketName}/uploads/${fileName}`;
}

export async function POST(req: Request) {
  try {
    const { caption, fileUrls, category, userId } = await req.json();

    if (!fileUrls || fileUrls.length === 0) {
      return NextResponse.json(
        { error: "Pelo menos uma imagem é obrigatória." },
        { status: 400 }
      );
    }

    // Corrigir URLs antes de salvar no banco
    const validUrls = fileUrls.map((url: string) => {
      if (url.startsWith("s3://")) {
        const fileName = url.split("/").pop();
        return generateFileUrl(fileName || "");
      }
      return url;
    });

    const post = await prisma.post.create({
      data: {
        caption,
        fileUrls: validUrls,
        category,
        userId,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Erro ao salvar post:", error);
    return NextResponse.json(
      { error: "Erro ao salvar post." },
      { status: 500 }
    );
  }
}
*/

