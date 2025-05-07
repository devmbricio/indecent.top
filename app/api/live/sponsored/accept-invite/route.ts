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
  AWS_REGION: process.env.AWS_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { inviteCode, userId, instagram } = await req.json();

    if (!inviteCode || !userId || !instagram) {
      return NextResponse.json({ error: "Código do convite, usuário e Instagram são obrigatórios." }, { status: 400 });
    }

    // 🔍 Verifica se o convite existe e está pendente
    const invite = await prisma.invite.findUnique({
      where: { code: inviteCode },
      include: { invitedBy: true },
    });

    if (!invite) {
      return NextResponse.json({ error: "Convite não encontrado." }, { status: 404 });
    }

    if (invite.status !== "pending") {
      return NextResponse.json({ error: "Convite já foi aceito ou expirado." }, { status: 400 });
    }

    // ✅ Atualiza o status do convite para "accepted"
    await prisma.invite.update({
      where: { id: invite.id },
      data: {
        status: "accepted",
        redeemedById: userId,
      },
    });

    console.log("🚀 Criando um novo canal IVS para a live...");

    // 🔥 **Criação do canal IVS**
    const channelResponse = await ivsClient.send(
      new CreateChannelCommand({
        name: `live_${invite.invitedById}_${Date.now()}`,
        type: "STANDARD",
        latencyMode: "LOW",
        authorized: false,
      })
    );

    if (!channelResponse.channel || !channelResponse.channel.arn) {
      return NextResponse.json({ error: "Erro ao criar canal IVS." }, { status: 500 });
    }

    console.log("✅ Canal IVS criado com sucesso! ARN:", channelResponse.channel.arn);

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

    // 🔥 **Criando o registro da Live no banco**
    const newLive = await prisma.live.create({
      data: {
        id: crypto.randomUUID(), // 🔹 Gerando um ID único automaticamente
        userId: invite.invitedById,
        guestInfluencerId: userId,
        guestInstagram: instagram,
        scheduledAt: invite.scheduledAt,
        status: "scheduled",
        playbackUrl: channelResponse.channel.playbackUrl || "",
        streamKey: streamKeyValue,
        ingestEndpoint: channelResponse.channel.ingestEndpoint || "",
        arn: channelResponse.channel.arn || "",
      },
    });

    console.log("✅ Live criada e salva no banco com sucesso:", newLive);

    return NextResponse.json({ success: true, live: newLive });
  } catch (error) {
    console.error("❌ Erro ao aceitar convite e criar live:", error);
    return NextResponse.json({ error: "Erro ao processar o convite." }, { status: 500 });
  }
}



/*
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ajuste para o caminho correto do seu Prisma Client

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { inviteCode, userId, instagram } = body;

    if (!inviteCode || !userId || !instagram) {
      return NextResponse.json({ error: "Invite code, userId, and instagram are required." }, { status: 400 });
    }

    const invite = await prisma.invite.findFirst({
      where: {
        code: inviteCode.trim(),
        status: "pending", // Garanta que o status é "pending"
      },
    });

    if (!invite) {
      return NextResponse.json({ error: "Invite not found or already accepted." }, { status: 404 });
    }

    await prisma.invite.update({
      where: { id: invite.id },
      data: {
        status: "accepted",
        redeemedById: userId,
      },
    });

    return NextResponse.json({ success: true, playbackUrl: `/live/${inviteCode}` });
  } catch (error) {
    console.error("Erro ao aceitar o convite:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
*/