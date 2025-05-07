import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Instanciando o cliente S3
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Função para gerar URL pública de arquivo no CloudFront
export function generateFileUrl(fileName: string): string {
  //const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN || "d72slz63e5c7n.cloudfront.net";
  const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN || "cdn.indecent.top";

  return `https://${cloudFrontDomain}/uploads/${fileName}`;
}

// Função para fazer upload de arquivos para o S3
export async function uploadFile(fileName: string, contentType: string, fileContent: Buffer) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `uploads/${fileName}`, // Define o caminho dentro do bucket
    Body: fileContent,
    ContentType: contentType,
    ACL: "private", // Arquivos privados, acessados apenas pelo CloudFront
  });

  try {
    await s3.send(command);
  } catch (error) {
    console.error("Erro ao fazer upload para o S3:", error);
    throw new Error("Falha no upload para o S3.");
  }
}

// Função para gerar URL assinada para download
export async function getDownloadUrl(fileName: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `uploads/${fileName}`,
  });

  try {
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return signedUrl;
  } catch (error) {
    console.error("Erro ao gerar URL assinada:", error);
    throw new Error("Falha ao gerar URL assinada.");
  }
}

// Função para remover domínio S3 e forçar CloudFront nas URLs assinadas (opcional)
export function convertToCloudFrontUrl(signedUrl: string): string {
  //const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN || "d72slz63e5c7n.cloudfront.net";
  const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN || "cdn.indecent.top";

  return signedUrl.replace(
    `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
    `https://${cloudFrontDomain}`
  );
}


/*
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  AWS_REGION: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Função para gerar URL assinada para upload
export async function getUploadUrl(fileName: string, contentType: string): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${fileName}`,
      ContentType: contentType,
      ACL: "public-read", // Garante que o arquivo será acessível publicamente
    });

    // Obtém a URL assinada
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // URL válida por 1 hora
    return signedUrl;
  } catch (error) {
    console.error("Erro ao gerar URL assinada para upload:", error);
    throw new Error("Erro ao gerar URL assinada para upload.");
  }
}

// Função para gerar URL assinada para download
export async function getDownloadUrl(fileName: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${fileName}`,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return signedUrl;
  } catch (error) {
    console.error("Erro ao gerar URL assinada para download:", error);
    throw new Error("Erro ao gerar URL assinada para download.");
  }
}

// Função para fazer upload de arquivos para o S3
export async function uploadFile(fileName: string, contentType: string, fileContent: Buffer) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/${fileName}`,
    Body: fileContent,
    ContentType: contentType,
    ACL: "public-read", // Garante acesso público
  });

  await s3.send(command);
}
*/