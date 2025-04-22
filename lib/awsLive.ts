import { IvsClient, GetChannelCommand } from "@aws-sdk/client-ivs";

// 🎥 Configuração do Cliente IVS
const ivsClient = new IvsClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// 📡 Canal IVS único para todos os influenciadores (REUTILIZADO)
const EXISTING_IVS_CHANNEL_ARN = "arn:aws:ivs:us-east-1:739275455963:channel/KbVpNXSlqZNv";

export async function getLiveStreamUrl(): Promise<string> {
  try {
    console.log(`[AWS IVS] 🔍 Verificando canal existente: ${EXISTING_IVS_CHANNEL_ARN}`);

    // 🚀 Buscar informações do canal IVS
    const command = new GetChannelCommand({ arn: EXISTING_IVS_CHANNEL_ARN });
    const response = await ivsClient.send(command);

    if (!response.channel?.playbackUrl) {
      throw new Error("Live stream não encontrada no AWS IVS.");
    }

    console.log(`[AWS IVS] ✅ Canal IVS ativo! Playback URL: ${response.channel.playbackUrl}`);
    return response.channel.playbackUrl;
  } catch (error: any) {
    if (error.name === "ResourceNotFoundException") {
      console.error(`[AWS IVS] ❌ Canal IVS não encontrado!`);
      throw new Error("O canal IVS configurado foi excluído.");
    }
    console.error("[AWS IVS] ❌ Erro ao buscar canal IVS:", error);
    throw new Error("Erro ao buscar URL de transmissão.");
  }
}



/*
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getSignedUrl as signCloudFrontUrl } from "@aws-sdk/cloudfront-signer";
import { readFileSync } from "fs";

// 🔐 Configuração do cliente S3
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// 🔥 Gerar URL pública via CloudFront
export function generateFileUrl(fileName: string): string {
  const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN || "d72slz63e5c7n.cloudfront.net";
  return `https://${cloudFrontDomain}/uploads/${fileName}`;
}

// 📌 Função para upload seguro para S3
export async function uploadFile(fileName: string, contentType: string, fileContent: Buffer) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `uploads/${fileName}`,
    Body: fileContent,
    ContentType: contentType,
    ACL: "private", // Apenas acessível via CloudFront
  });

  try {
    await s3.send(command);
  } catch (error) {
    console.error("Erro ao fazer upload para o S3:", error);
    throw new Error("Falha no upload para o S3.");
  }
}

// 🔑 Gerar URL assinada para download via S3
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

// 🔥 Gerar URL segura assinada do CloudFront
export function generateSignedCloudFrontUrl(filePath: string): string {
  const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN!;
  const keyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID!;
  const privateKey = readFileSync("cloudfront_private_key.pem", "utf8");

  return signCloudFrontUrl({
    url: `https://${cloudFrontDomain}${filePath}`,
    keyPairId,
    privateKey,
    dateLessThan: new Date(Date.now() + 3600 * 1000).toISOString(), // Expira em 1h
  });
}
*/


/*
import { IvsClient, GetChannelCommand } from "@aws-sdk/client-ivs";
import prisma from "@/lib/prisma";

const ivsClient = new IvsClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getLiveStreamUrl(influencerId: string): Promise<string> {
  try {
    console.log(`[AWS IVS] Buscando canal no banco de dados para ${influencerId}`);

    const liveStream = await prisma.liveStream.findUnique({
      where: { influencerId },
    });

    if (!liveStream) {
      console.warn(`[AWS IVS] Nenhuma live encontrada no banco de dados para ${influencerId}`);
      throw new Error("Live stream não encontrada no banco de dados.");
    }

    console.log(`[AWS IVS] Canal encontrado no DB: ${liveStream.channelArn}`);

    const command = new GetChannelCommand({ arn: liveStream.channelArn });
    const response = await ivsClient.send(command);

    if (!response.channel || !response.channel.playbackUrl) {
      throw new Error("Live stream não encontrada no AWS IVS.");
    }

    return response.channel.playbackUrl;
  } catch (error) {
    console.error("[AWS IVS] Erro ao obter URL da live:", error);
    throw new Error("Erro ao buscar transmissão ao vivo.");
  }
}
*/