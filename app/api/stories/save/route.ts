import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { videoUrl, userId, expiresIn } = await req.json();

  if (!videoUrl || !userId || !expiresIn) {
    return NextResponse.json({ error: "Parâmetros inválidos." }, { status: 400 });
  }

  try {
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + expiresIn);

    // Criação do registro no banco de dados com a URL do vídeo e outros dados
    const story = await prisma.story.create({
      data: {
        videoUrl,
        userId,
        expiresAt: expirationDate,
        thumbnailUrl: "/indecent.top_logo_9-16.png", // Placeholder para thumbnail
        saved: false, // Indicando que o story ainda não foi "salvo" ou completado
      },
    });

    return NextResponse.json(story); // Retorna o story criado
  } catch (error) {
    console.error("Erro ao salvar story:", error);
    return NextResponse.json({ error: "Erro ao salvar story." }, { status: 500 });
  }
}






/*


import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import path from "path";
import fs from "fs";
import AWS from "aws-sdk";
import { exec } from "child_process";

// Função para gerar a URL completa do arquivo no CloudFront
function generateFileUrl(fileName: string): string {
  const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN || "d72slz63e5c7n.cloudfront.net";
  return `https://${cloudFrontDomain}/stories/${fileName}`; // URL completa usando CloudFront
}

// Função para gerar a URL do thumbnail no CloudFront
function generateThumbnailUrl(fileName: string): string {
  const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN || "d72slz63e5c7n.cloudfront.net";
  return `https://${cloudFrontDomain}/stories/thumbnails/${fileName}`;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession({ req, ...authOptions });

  if (!session) {
    return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 });
  }

  const { videoUrl, userId, expiresIn } = await req.json();

  // Validação de parâmetros
  if (!videoUrl || !userId || !expiresIn) {
    return NextResponse.json({ message: "Parâmetros inválidos." }, { status: 400 });
  }

  try {
    const fullVideoUrl = generateFileUrl(videoUrl);

    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + expiresIn);

    // Cria o story no banco de dados com a URL do CloudFront
    const savedStory = await prisma.story.create({
      data: {
        videoUrl: fullVideoUrl,
        userId,
        expiresAt: expirationDate,
        thumbnailUrl: "", // Será atualizado após o processamento
      },
    });

    try {
      // Caminhos locais e do thumbnail
      const videoPath = path.join("/tmp", path.basename(fullVideoUrl));
      const thumbnailPath = videoPath.replace(".mp4", ".jpg");

      // Baixa o vídeo localmente
      console.log("Baixando o vídeo para:", videoPath);
      await downloadFile(fullVideoUrl, videoPath);

      // Gera o thumbnail
      console.log("Gerando o thumbnail...");
      await generateThumbnail(videoPath, thumbnailPath);

      // Faz upload do thumbnail para o S3
      const thumbnailKey = `stories/thumbnails/${path.basename(thumbnailPath)}`;
      await uploadToS3(thumbnailPath, thumbnailKey);

      // Atualiza o URL do thumbnail no banco de dados
      const thumbnailUrl = generateThumbnailUrl(path.basename(thumbnailPath));
      console.log("Atualizando o thumbnail no banco de dados...");
      await prisma.story.update({
        where: { id: savedStory.id },
        data: { thumbnailUrl },
      });

      console.log("Thumbnail salvo com sucesso:", thumbnailUrl);
    } catch (error) {
      console.error("Erro ao processar o thumbnail:", error);
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Erro ao salvar story:", error);
    return NextResponse.json({ message: "Erro ao salvar story." }, { status: 500 });
  }
}

// Função para gerar o thumbnail com o ffmpeg
function generateThumbnail(videoPath: string, thumbnailPath: string) {
  return new Promise((resolve, reject) => {
    const command = `ffmpeg -i ${videoPath} -ss 00:00:01.000 -vframes 1 ${thumbnailPath}`;
    exec(command, (error) => {
      if (error) {
        console.error("Erro no ffmpeg:", error);
        reject(error);
      } else {
        console.log("Thumbnail gerado em:", thumbnailPath);
        resolve(thumbnailPath);
      }
    });
  });
}

// Função para baixar um arquivo do CloudFront localmente
function downloadFile(url: string, dest: string) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const https = require("https");
    const request = https.get(url, (response: any) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Erro no download: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on("finish", () => {
        file.close(resolve);
      });
    });

    request.on("error", (err: any) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

// Função para fazer upload de um arquivo para o S3
function uploadToS3(filePath: string, s3Key: string) {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_AWS_SECRET_ACCESS_KEY!,
    AWS_REGION: process.env.AWS_AWS_REGION!,
  });

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) return reject(err);

      s3.putObject(
        {
          Bucket: process.env.AWS_AWS_BUCKET_NAME!,
          Key: s3Key,
          Body: data,
          ContentType: "image/jpeg",
        },
        (error: any) => {
          if (error) {
            console.error("Erro no upload para o S3:", error);
            return reject(error);
          }
          resolve(true);
        }
      );
    });
  });
}
*/


/*
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import path from "path";
import fs from "fs";
import AWS from "aws-sdk";
import { exec } from "child_process";

// Função para gerar a URL completa do arquivo no S3
function generateFileUrl(fileName: string): string {
  // Garantir que o Bucket esteja definido
  const bucketName = process.env.AWS_AWS_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("A variável de ambiente AWS_AWS_BUCKET_NAME não está definida.");
  }

  const AWS_REGION = process.env.AWS_AWS_REGION || "us-east-2"; // Valor padrão para a região, se necessário.
  return `https://s3.${AWS_REGION}.amazonaws.com/${bucketName}/stories/${fileName}`; // URL completa
}

export async function POST(req: NextRequest) {
  const session = await getServerSession({ req, ...authOptions });

  if (!session) {
    return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 });
  }

  const { videoUrl, userId, expiresIn } = await req.json();

  // Validação de parâmetros
  if (!videoUrl || !userId || !expiresIn) {
    return NextResponse.json({ message: "Parâmetros inválidos." }, { status: 400 });
  }

  try {
    // Gerar URL completa para o vídeo
    const fullVideoUrl = generateFileUrl(videoUrl); // Certifique-se de que o vídeo tenha a URL completa

    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + expiresIn);

    // Cria o story no banco de dados com a URL completa
    const savedStory = await prisma.story.create({
      data: {
        videoUrl: fullVideoUrl, // Salva a URL completa
        userId,
        expiresAt: expirationDate,
        thumbnailUrl: "", // Inicializa com vazio ou com algum valor, se necessário
      },
    });

    console.log("Story criado com sucesso:", savedStory);

    try {
      // Caminhos para o vídeo e thumbnail
      const videoPath = path.join("/tmp", path.basename(fullVideoUrl));
      const thumbnailPath = videoPath.replace(".mp4", ".jpg");

      // Baixa o vídeo localmente
      console.log("Baixando o vídeo para:", videoPath);
      await downloadFile(fullVideoUrl, videoPath);

      // Gera o thumbnail
      console.log("Gerando o thumbnail...");
      await generateThumbnail(videoPath, thumbnailPath);

      // Faz upload do thumbnail para o S3
      const thumbnailKey = `stories/thumbnails/${path.basename(thumbnailPath)}`;
      const thumbnailUrl = `https://${process.env.AWS_AWS_BUCKET_NAME}.s3.${process.env.AWS_AWS_REGION}.amazonaws.com/${thumbnailKey}`;

      console.log("Fazendo upload do thumbnail...");
      await uploadToS3(thumbnailPath, thumbnailKey);

      // Atualiza o registro no banco de dados com o thumbnail
      console.log("Atualizando o thumbnail no banco de dados...");
      await prisma.story.update({
        where: { id: savedStory.id },
        data: { thumbnailUrl },
      });

      console.log("Thumbnail salvo com sucesso:", thumbnailUrl);
    } catch (error) {
      console.error("Erro ao processar o thumbnail:", error);
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Erro ao salvar story:", error);
    return NextResponse.json({ message: "Erro ao salvar story." }, { status: 500 });
  }
}

// Função para gerar o thumbnail com o ffmpeg
function generateThumbnail(videoPath: string, thumbnailPath: string) {
  return new Promise((resolve, reject) => {
    const command = `ffmpeg -i ${videoPath} -ss 00:00:01.000 -vframes 1 ${thumbnailPath}`;
    exec(command, (error) => {
      if (error) {
        console.error("Erro no ffmpeg:", error);
        reject(error);
      } else {
        console.log("Thumbnail gerado em:", thumbnailPath);
        resolve(thumbnailPath);
      }
    });
  });
}

// Função para baixar um arquivo do S3 localmente
function downloadFile(url: string, dest: string) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const https = require("https");
    const request = https.get(url, (response: any) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Erro no download: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on("finish", () => {
        file.close(resolve);
      });
    });

    request.on("error", (err: any) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

// Função para fazer upload de um arquivo para o S3
function uploadToS3(filePath: string, s3Key: string) {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_AWS_REGION,
  });

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) return reject(err);

      s3.putObject(
        {
          Bucket: process.env.AWS_AWS_BUCKET_NAME!, // Aqui garantimos que a variável esteja definida
          Key: s3Key,
          Body: data,
          ContentType: "image/jpeg", // Conteúdo do thumbnail
        },
        (error: any) => {
          if (error) {
            console.error("Erro no upload do S3:", error);
            return reject(error);
          }
          resolve(true);
        }
      );
    });
  });
}
*/



/* funcional mas com errinho exec
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import path from "path";
import fs from "fs";
import AWS from "aws-sdk";

// Função para gerar a URL completa do arquivo no S3
function generateFileUrl(fileName: string): string {
  const bucketName = process.env.AWS_AWS_BUCKET_NAME || "indecent.top";
  const AWS_REGION = process.env.AWS_AWS_REGION || "us-east-2";
  return `https://s3.${AWS_REGION}.amazonaws.com/${bucketName}/stories/${fileName}`; // URL completa
}

export async function POST(req: NextRequest) {
  const session = await getServerSession({ req, ...authOptions });

  if (!session) {
    return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 });
  }

  const { videoUrl, userId, expiresIn } = await req.json();

  // Validação de parâmetros
  if (!videoUrl || !userId || !expiresIn) {
    return NextResponse.json({ message: "Parâmetros inválidos." }, { status: 400 });
  }

  try {
    // Gerar URL completa para o vídeo
    const fullVideoUrl = generateFileUrl(videoUrl); // Certifique-se de que o vídeo tenha a URL completa

    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + expiresIn);

    // Cria o story no banco de dados com a URL completa
    const savedStory = await prisma.story.create({
      data: {
        videoUrl: fullVideoUrl, // Salva a URL completa
        userId,
        expiresAt: expirationDate,
        thumbnailUrl: "", // Inicializa com vazio ou com algum valor, se necessário
      },
    });

    console.log("Story criado com sucesso:", savedStory);

    try {
      // Caminhos para o vídeo e thumbnail
      const videoPath = path.join("/tmp", path.basename(fullVideoUrl));
      const thumbnailPath = videoPath.replace(".mp4", ".jpg");

      // Baixa o vídeo localmente
      console.log("Baixando o vídeo para:", videoPath);
      await downloadFile(fullVideoUrl, videoPath);

      // Gera o thumbnail
      console.log("Gerando o thumbnail...");
      await generateThumbnail(videoPath, thumbnailPath);

      // Faz upload do thumbnail para o S3
      const thumbnailKey = `stories/thumbnails/${path.basename(thumbnailPath)}`;
      const thumbnailUrl = `https://${process.env.AWS_AWS_BUCKET_NAME}.s3.${process.env.AWS_AWS_REGION}.amazonaws.com/${thumbnailKey}`;

      console.log("Fazendo upload do thumbnail...");
      await uploadToS3(thumbnailPath, thumbnailKey);

      // Atualiza o registro no banco de dados com o thumbnail
      console.log("Atualizando o thumbnail no banco de dados...");
      await prisma.story.update({
        where: { id: savedStory.id },
        data: { thumbnailUrl },
      });

      console.log("Thumbnail salvo com sucesso:", thumbnailUrl);
    } catch (error) {
      console.error("Erro ao processar o thumbnail:", error);
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Erro ao salvar story:", error);
    return NextResponse.json({ message: "Erro ao salvar story." }, { status: 500 });
  }
}

// Função para gerar o thumbnail com o ffmpeg
function generateThumbnail(videoPath: string, thumbnailPath: string) {
  return new Promise((resolve, reject) => {
    const command = `ffmpeg -i ${videoPath} -ss 00:00:01.000 -vframes 1 ${thumbnailPath}`;
    exec(command, (error) => {
      if (error) {
        console.error("Erro no ffmpeg:", error);
        reject(error);
      } else {
        console.log("Thumbnail gerado em:", thumbnailPath);
        resolve(thumbnailPath);
      }
    });
  });
}

// Função para baixar um arquivo do S3 localmente
function downloadFile(url: string, dest: string) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const https = require("https");
    const request = https.get(url, (response: any) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Erro no download: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on("finish", () => {
        file.close(resolve);
      });
    });

    request.on("error", (err: any) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

// Função para fazer upload de um arquivo para o S3
function uploadToS3(filePath: string, s3Key: string) {
  const AWS = require("aws-sdk");
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_AWS_REGION,
  });

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) return reject(err);

      s3.putObject(
        {
          Bucket: process.env.AWS_AWS_BUCKET_NAME,
          Key: s3Key,
          Body: data,
          ContentType: "image/jpeg",
        },
        (error: any) => {
          if (error) {
            console.error("Erro no upload do S3:", error);
            return reject(error);
          }
          resolve(true);
        }
      );
    });
  });
}
*/
