import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {
  IvsClient,
  CreateChannelCommand,
  CreateStreamKeyCommand,
  ListStreamKeysCommand,
  GetStreamKeyCommand,
} from "@aws-sdk/client-ivs";

const prisma = new PrismaClient();
const ivsClient = new IvsClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    console.log("📡 Criando canal IVS...");

    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "ID do usuário é obrigatório." }, { status: 400 });
    }

    console.log(`🔎 Verificando se o usuário ${userId} já tem um canal ativo...`);
    let existingLive = await prisma.live.findUnique({
      where: { id: userId },
    });

    if (existingLive) {
      console.log("✅ Canal existente encontrado:", existingLive);
      return NextResponse.json(existingLive);
    }

    console.log("🚀 Criando um novo canal IVS...");
    const channelResponse = await ivsClient.send(
      new CreateChannelCommand({
        name: `live_${userId}_${Date.now()}`,
        type: "STANDARD",
        latencyMode: "LOW",
        authorized: false,
      })
    );

    if (!channelResponse.channel || !channelResponse.channel.arn) {
      return NextResponse.json({ error: "Erro ao criar canal no IVS." }, { status: 500 });
    }

    console.log("✅ Canal IVS criado! ARN:", channelResponse.channel.arn);

    let streamKeyValue = "";
    const keyListResponse = await ivsClient.send(new ListStreamKeysCommand({ channelArn: channelResponse.channel.arn }));

    if (keyListResponse.streamKeys?.length) {
      console.log("✅ Stream Key existente encontrada.");
      const getStreamKeyResponse = await ivsClient.send(
        new GetStreamKeyCommand({ arn: keyListResponse.streamKeys[0].arn })
      );
      streamKeyValue = getStreamKeyResponse.streamKey?.value || "";
    }

    if (!streamKeyValue) {
      console.log("🔄 Criando uma nova Stream Key...");
      const streamKeyResponse = await ivsClient.send(
        new CreateStreamKeyCommand({ channelArn: channelResponse.channel.arn })
      );
      streamKeyValue = streamKeyResponse.streamKey?.value || "";
    }

    // Criar registro no banco de dados
    const newLive = await prisma.live.create({
      data: {
        id: userId,
        userId: userId,
        playbackUrl: channelResponse.channel.playbackUrl || "",
        streamKey: streamKeyValue,
        ingestEndpoint: channelResponse.channel.ingestEndpoint || "",
        arn: channelResponse.channel.arn || "",
        status: "active",
        scheduledAt: new Date(), 
      },
    });

    console.log("✅ Canal salvo no banco:", newLive);
    return NextResponse.json(newLive);
  } catch (error) {
    console.error("❌ Erro ao criar canal no IVS:", error);
    return NextResponse.json({ error: "Erro ao criar canal no IVS." }, { status: 500 });
  }
}
