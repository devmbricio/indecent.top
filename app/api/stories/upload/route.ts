import { NextRequest, NextResponse } from "next/server";
import { generatePresignedUrl } from "@/lib/s3-video-utils"; // Função para gerar a URL pré-assinada

// Função POST para gerar a URL pré-assinada do S3
export async function POST(req: NextRequest) {
  try {
    const { videoName, contentType } = await req.json();

    if (!videoName || !contentType) {
      return NextResponse.json({ error: "Nome e tipo de conteúdo são obrigatórios" }, { status: 400 });
    }

    // Gerar URL pré-assinada para o upload no S3
    const uploadUrl = await generatePresignedUrl(videoName, contentType);

    // Retorna a URL pré-assinada ao frontend para o upload direto ao S3
    return NextResponse.json({ uploadUrl });
  } catch (error) {
    console.error("Erro ao gerar URL pré-assinada", error);
    return NextResponse.json({ error: "Erro interno ao gerar URL pré-assinada" }, { status: 500 });
  }
}



/*


import { NextResponse } from "next/server";
import { uploadVideoFile } from "@/lib/s3-video-utils";

export async function POST(req: Request) {
  try {
    const { videoName, contentType } = await req.json();

    if (!videoName || !contentType) {
      return NextResponse.json({ error: "Parâmetros inválidos." }, { status: 400 });
    }

    // Recuperar o arquivo do corpo da requisição
    const file = req.body; // Ajuste conforme como você está recebendo o arquivo no backend (por exemplo, via form-data)

    const fileKey = `stories/${videoName}`;
    const publicUrl = await uploadVideoFile(fileKey, contentType, file); // Passando o arquivo para a função

    return NextResponse.json({ publicUrl });
  } catch (error) {
    console.error("Erro ao fazer upload do vídeo:", error);
    return NextResponse.json({ error: "Erro ao fazer upload do vídeo." }, { status: 500 });
  }
}
*/