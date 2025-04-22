import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// 🔥 Gerar URL pré-assinada para upload de vídeos
export async function POST(req: Request) {
  try {
    const { fileName, contentType } = await req.json();

    if (!fileName || !contentType) {
      return NextResponse.json({ error: "Nome do arquivo e tipo são obrigatórios." }, { status: 400 });
    }

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `videos/${fileName}`,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return NextResponse.json({ uploadUrl: signedUrl });
  } catch (error) {
    console.error("Erro ao gerar URL pré-assinada:", error);
    return NextResponse.json({ error: "Erro ao gerar URL." }, { status: 500 });
  }
}
