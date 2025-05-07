import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Configuração do cliente S3
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});


// Função para gerar a URL pré-assinada para upload no S3
export async function generatePresignedUrl(fileName: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `stories/${fileName}`, // Caminho do arquivo no S3
    ContentType: contentType,
  });

  try {
    // Gera a URL pré-assinada válida por 1 hora
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // Expira em 1 hora
    return signedUrl;
  } catch (error) {
    console.error("Erro ao gerar URL pré-assinada:", error);
    throw new Error("Erro ao gerar URL pré-assinada");
  }
}

// Função para gerar a URL pública do arquivo no CloudFront
// lib/s3-video-utils.ts
export function generateFileUrl(fileName: string): string {
  //const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN || "d72slz63e5c7n.cloudfront.net";
  const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN || "cdn.indecent.top";

  return `https://${cloudFrontDomain}/stories/${fileName}`; // URL pública no CloudFront
}
