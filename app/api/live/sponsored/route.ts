import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {
  IvsClient,
  CreateChannelCommand,
  CreateStreamKeyCommand,
  ListStreamKeysCommand,
  GetStreamKeyCommand,
} from "@aws-sdk/client-ivs";
import { ObjectId } from "bson";

const prisma = new PrismaClient();
const ivsClient = new IvsClient({
  AWS_REGION: process.env.AWS_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    console.log("📡 Criando live patrocinada...");

    const { userId, credits, duration, guestInstagram, selectedInfluencer, imageUrl, inviteCode } = await req.json();
    console.log("📥 Parâmetros recebidos:", { userId, credits, duration, guestInstagram, selectedInfluencer });

    if (!userId || credits <= 0 || duration <= 0) {
      return NextResponse.json({ error: "Parâmetros inválidos." }, { status: 400 });
    }

    let guestInfluencerId: string | null = null;
    let guestInstagramStored: string | null = guestInstagram || null;
    let liveId = new ObjectId().toString(); // Gerando um ID válido do MongoDB

    // 🔎 Verifica se o convidado já tem conta
    if (selectedInfluencer) {
      guestInfluencerId = selectedInfluencer;
      guestInstagramStored = null;
    } else {
      const existingUser = await prisma.user.findUnique({ where: { instagram: guestInstagram } });
      if (existingUser) {
        guestInfluencerId = existingUser.id;
        guestInstagramStored = null;
      }
    }

    // 🔎 Verifica se o usuário já tem uma live ativa
    let existingLive = await prisma.live.findFirst({ where: { userId } });

    let streamKeyValue = "";
    let ingestEndpoint = "";
    let playbackUrl = "";
    let channelArn = "";

    if (existingLive) {
      console.log("✅ Canal existente encontrado:", existingLive);
      channelArn = existingLive.arn;
      ingestEndpoint = existingLive.ingestEndpoint;
      playbackUrl = existingLive.playbackUrl;

      // 🔎 Busca a Stream Key existente
      const keyListResponse = await ivsClient.send(new ListStreamKeysCommand({ channelArn }));
      if (keyListResponse.streamKeys?.length) {
        const getStreamKeyResponse = await ivsClient.send(
          new GetStreamKeyCommand({ arn: keyListResponse.streamKeys[0].arn })
        );
        streamKeyValue = getStreamKeyResponse.streamKey?.value || "";
      }
    } else {
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

      channelArn = channelResponse.channel.arn;
      ingestEndpoint = channelResponse.channel.ingestEndpoint || "";
      playbackUrl = channelResponse.channel.playbackUrl || "";

      console.log("🔄 Criando uma nova Stream Key...");
      const streamKeyResponse = await ivsClient.send(new CreateStreamKeyCommand({ channelArn }));
      streamKeyValue = streamKeyResponse.streamKey?.value || "";
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

if (!user) {
  return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
}

if (user.credits < credits) {
  return NextResponse.json({ error: "Créditos insuficientes." }, { status: 400 });
}

// Congela os créditos durante a live
await prisma.user.update({
  where: { id: userId },
  data: {
    credits: { decrement: credits },       // Reduz créditos do usuário
    accumulativeCredits: { increment: credits }, // Adiciona ao acumulativo
  },
});


    // 🔹 Criar a Live patrocinada no banco de dados
    const newLive = await prisma.live.create({
      data: {
        id: liveId,
        userId,
        creditsFrozen: credits,
        duration,
        playbackUrl,
        streamKey: streamKeyValue,
        ingestEndpoint,
        arn: channelArn,
        status: "pending",
        guestInfluencerId,
        guestInstagram: guestInstagramStored,
        imageUrl: imageUrl || "",
        inviteCode: inviteCode || null,
        sponsored: true,
        scheduledAt: new Date(), 
      },
    });

    console.log("✅ Live patrocinada criada com sucesso!", newLive);

    // Retorna o URL correto para acessar a live patrocinada
    const liveUrl = `/live/live-boss/${newLive.id}/${newLive.inviteCode}`;
    return NextResponse.json({ success: true, liveId: newLive.id, url: liveUrl });

  } catch (error) {
    console.error("❌ Erro ao criar live patrocinada:", error);
    return NextResponse.json({ error: "Erro ao criar live patrocinada." }, { status: 500 });
  }
}


/* funcional mas id ainda e apenas id nao id + invite
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {
  IvsClient,
  CreateChannelCommand,
  CreateStreamKeyCommand,
  ListStreamKeysCommand,
  GetStreamKeyCommand,
} from "@aws-sdk/client-ivs";
import { ObjectId } from "bson"; // Importa ObjectId para garantir IDs válidos

const prisma = new PrismaClient();
const ivsClient = new IvsClient({
  AWS_REGION: process.env.AWS_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    console.log("📡 Criando live patrocinada...");

    const { userId, credits, duration, guestInstagram, selectedInfluencer, imageUrl, inviteCode } = await req.json();
    console.log("📥 Parâmetros recebidos:", { userId, credits, duration, guestInstagram, selectedInfluencer });

    if (!userId || credits <= 0 || duration <= 0) {
      return NextResponse.json({ error: "Parâmetros inválidos." }, { status: 400 });
    }

    let guestInfluencerId: string | null = null;
    let guestInstagramStored: string | null = guestInstagram || null;
    let liveId = new ObjectId().toString(); // 🔹 ID gerado pelo MongoDB por padrão

    // 🔎 Verifica se o convidado já tem conta
    if (selectedInfluencer) {
      guestInfluencerId = selectedInfluencer;
      guestInstagramStored = null;
    } else {
      const existingUser = await prisma.user.findUnique({ where: { instagram: guestInstagram } });
      if (existingUser) {
        guestInfluencerId = existingUser.id;
        guestInstagramStored = null;
      }
    }

    // 🔎 Verifica se o usuário já tem uma live ativa
    let existingLive = await prisma.live.findFirst({ where: { userId } });

    let streamKeyValue = "";
    let ingestEndpoint = "";
    let playbackUrl = "";
    let channelArn = "";

    if (existingLive) {
      console.log("✅ Canal existente encontrado:", existingLive);
      channelArn = existingLive.arn;
      ingestEndpoint = existingLive.ingestEndpoint;
      playbackUrl = existingLive.playbackUrl;

      // 🔎 Busca a Stream Key existente
      const keyListResponse = await ivsClient.send(new ListStreamKeysCommand({ channelArn }));
      if (keyListResponse.streamKeys?.length) {
        const getStreamKeyResponse = await ivsClient.send(
          new GetStreamKeyCommand({ arn: keyListResponse.streamKeys[0].arn })
        );
        streamKeyValue = getStreamKeyResponse.streamKey?.value || "";
      }
    } else {
      // 🔹 Criar um novo canal IVS
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

      channelArn = channelResponse.channel.arn;
      ingestEndpoint = channelResponse.channel.ingestEndpoint || "";
      playbackUrl = channelResponse.channel.playbackUrl || "";

      // 🔹 Criar uma nova Stream Key
      console.log("🔄 Criando uma nova Stream Key...");
      const streamKeyResponse = await ivsClient.send(new CreateStreamKeyCommand({ channelArn }));
      streamKeyValue = streamKeyResponse.streamKey?.value || "";
    }

    // 🔹 Criar a Live patrocinada no banco de dados
    const newLive = await prisma.live.create({
      data: {
        id: liveId, // ✅ Agora sempre será um ObjectId válido
        userId,
        creditsFrozen: credits, // Créditos bloqueados até 80% da live ser concluída
        duration,
        playbackUrl,
        streamKey: streamKeyValue,
        ingestEndpoint,
        arn: channelArn,
        status: "pending",
        guestInfluencerId,
        guestInstagram: guestInstagramStored,
        imageUrl: imageUrl || "",
        inviteCode: inviteCode || null,
        sponsored: true,
      },
    });

    console.log("✅ Live patrocinada criada com sucesso!", newLive);
    return NextResponse.json({ success: true, liveId: newLive.id });

  } catch (error) {
    console.error("❌ Erro ao criar live patrocinada:", error);
    return NextResponse.json({ error: "Erro ao criar live." }, { status: 500 });
  }
}
*/



