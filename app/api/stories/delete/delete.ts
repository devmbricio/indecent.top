import prisma from "@/lib/prisma";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  AWS_REGION: process.env.AWS_AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_AWS_SECRET_ACCESS_KEY!,
  },
});

export default async function handler() {
  try {
    // Buscar stories que expiraram há mais de 24 horas
    const expiredStories = await prisma.story.findMany({
      where: {
        createdAt: {
          lt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Stories mais antigos que 24 horas
        },
      },
    });

    for (const story of expiredStories) {
      // Extrair a chave do vídeo a partir da URL
      const objectKey = story.videoUrl.replace(
        `https://${process.env.AWS_AWS_BUCKET_NAME}.s3.${process.env.AWS_AWS_REGION}.amazonaws.com/`,
        ""
      );

      // Comando para deletar o objeto do S3
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_AWS_BUCKET_NAME!,
        Key: objectKey,
      });

      // Deletar o arquivo do S3
      await s3.send(deleteCommand);

      // Remover o registro do banco de dados
      await prisma.story.delete({ where: { id: story.id } });
    }

    console.log("Stories expirados deletados com sucesso.");
  } catch (error) {
    console.error("Erro ao deletar stories expirados:", error);
  }
}
