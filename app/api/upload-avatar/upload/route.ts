// /api/upload-avatar/upload.ts
import { NextResponse } from "next/server";
import { uploadFile, generateFileUrl } from "@/lib/s3-utils";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "O arquivo enviado não é válido." },
        { status: 400 }
      );
    }

    const fileName = file.name;
    const contentType = file.type;

    // Obter o conteúdo do arquivo em buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Realizar o upload do arquivo para o S3
    await uploadFile(fileName, contentType, buffer);

    // Gerar URL pública utilizando CloudFront
    const fileUrl = generateFileUrl(fileName);

    return NextResponse.json({ fileUrl });
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    return NextResponse.json(
      { error: "Erro ao fazer upload da imagem" },
      { status: 500 }
    );
  }
}
