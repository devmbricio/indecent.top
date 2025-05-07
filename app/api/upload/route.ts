
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Configurar AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const { fileName, contentType } = await request.json();

    // Validar parâmetros obrigatórios
    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: "fileName e contentType são obrigatórios." },
        { status: 400 }
      );
    }

    // Nome do bucket e domínio do CloudFront
    const bucketName = process.env.AWS_BUCKET_NAME!;
    const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN || "d72slz63e5c7n.cloudfront.net";

    // Caminho completo do arquivo no bucket
    const key = `uploads/${Date.now()}-${fileName}`;

    // Criar comando para geração da URL assinada
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
      ACL: "private", // Arquivos privados, acessados apenas pelo CloudFront
    });

    // Gerar URL assinada para upload
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    // Gerar URL pública de acesso ao arquivo no CloudFront
    const fileUrl = `https://${cloudFrontDomain}/${key}`;

    // Retornar URLs geradas
    return NextResponse.json({ uploadUrl, fileUrl });
  } catch (error) {
    console.error("Erro ao gerar URL assinada:", error);
    return NextResponse.json(
      { error: "Erro ao gerar URL assinada." },
      { status: 500 }
    );
  }
}
/*


import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Configurar AWS S3
const s3 = new S3Client({
  AWS_REGION: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const { fileName, contentType } = await request.json();

    // Validar parâmetros obrigatórios
    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: "fileName e contentType são obrigatórios." },
        { status: 400 }
      );
    }

    // Nome do bucket
    const bucketName = process.env.AWS_BUCKET_NAME;
    const AWS_REGION = process.env.AWS_REGION;

    if (!bucketName || !AWS_REGION) {
      return NextResponse.json(
        { error: "As variáveis de ambiente AWS_BUCKET_NAME e AWS_REGION são obrigatórias." },
        { status: 500 }
      );
    }

    // Caminho completo do arquivo no bucket
    const key = `uploads/${Date.now()}-${fileName}`;

    // Criar comando para geração da URL assinada
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });

    // Gerar URL assinada para upload
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    // Gerar URL pública de acesso ao arquivo no S3
    const fileUrl = `https://${bucketName}.s3.${AWS_REGION}.amazonaws.com/${key}`;

    // Retornar URLs geradas
    return NextResponse.json({ uploadUrl, fileUrl });
  } catch (error) {
    console.error("Erro ao gerar URL assinada:", error);
    return NextResponse.json(
      { error: "Erro ao gerar URL assinada." },
      { status: 500 }
    );
  }
}
*/


/* funcional antes de dar pau no stories

import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Configurar AWS S3
const s3 = new S3Client({
  AWS_REGION: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const { fileName, contentType } = await request.json();

    // Validar parâmetros obrigatórios
    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: "fileName e contentType são obrigatórios." },
        { status: 400 }
      );
    }

    // Nome do bucket
    const bucketName = process.env.AWS_BUCKET_NAME;
    const AWS_REGION = process.env.AWS_REGION;

    if (!bucketName || !AWS_REGION) {
      return NextResponse.json(
        { error: "As variáveis de ambiente AWS_BUCKET_NAME e AWS_REGION são obrigatórias." },
        { status: 500 }
      );
    }

    // Caminho completo do arquivo no bucket
    const key = `uploads/${Date.now()}-${fileName}`;

    // Criar comando para geração da URL assinada
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });

    // Gerar URL assinada para upload
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    // Gerar URL pública de acesso ao arquivo no S3
    const fileUrl = `https://${bucketName}.s3.${AWS_REGION}.amazonaws.com/${key}`;

    // Retornar URLs geradas
    return NextResponse.json({ uploadUrl, fileUrl });
  } catch (error) {
    console.error("Erro ao gerar URL assinada:", error);
    return NextResponse.json(
      { error: "Erro ao gerar URL assinada." },
      { status: 500 }
    );
  }
}
*/




/*


import { NextResponse } from "next/server";
import AWS from "aws-sdk";

// Configurar AWS S3
const s3 = new AWS.S3({
  AWS_REGION: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function POST(request: Request) {
  try {
    const { fileName, contentType } = await request.json();

    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: "fileName e contentType são obrigatórios." },
        { status: 400 }
      );
    }

    // Parâmetros da URL assinada
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${Date.now()}-${fileName}`,
      Expires: 60, // URL válida por 60 segundos
      ContentType: contentType,
    };

    // Gerar URL assinada
    const uploadUrl = await s3.getSignedUrlPromise("putObject", params);

    return NextResponse.json({
      uploadUrl,
      fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`,
    });
  } catch (error) {
    console.error("Erro ao gerar URL assinada:", error);
    return NextResponse.json(
      { error: "Erro ao gerar URL assinada." },
      { status: 500 }
    );
  }
}
*/