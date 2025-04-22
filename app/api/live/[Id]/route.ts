
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id?: string; Id?: string } }) {
  console.log("📡 Recebendo requisição para buscar live...");
  console.log("📡 Parâmetros recebidos:", params);

  const userId = params.id || params.Id; // Agora `id` é o próprio `userId`

  if (!userId) {
    console.error("🚨 Erro: ID do usuário não foi enviado.");
    return NextResponse.json({ error: "ID do usuário é obrigatório." }, { status: 400 });
  }

  try {
    console.log(`🔎 Buscando live ativa para o usuário ID: ${userId}...`);

    // Buscar a live ativa associada ao usuário
    const live = await prisma.live.findUnique({ where: { id: userId } });

    if (!live) {
      console.error(`❌ Nenhuma live ativa encontrada para usuário ID: ${userId}`);
      return NextResponse.json({ error: "Live não encontrada ou offline." }, { status: 404 });
    }

    console.log("✅ Live encontrada no banco:", live);

    return NextResponse.json({
      userId: live.id,
      playbackUrl: live.playbackUrl,
      streamKey: live.streamKey,
      ingestEndpoint: live.ingestEndpoint,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar a live no banco:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}

/*
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id?: string; Id?: string } }) {
  console.log("📡 Recebendo requisição para buscar live...");
  console.log("📡 Parâmetros recebidos:", params);

  const userId = params.id || params.Id; // Agora `id` é o próprio `userId`

  if (!userId) {
    console.error("🚨 Erro: ID do usuário não foi enviado.");
    return NextResponse.json({ error: "ID do usuário é obrigatório." }, { status: 400 });
  }

  try {
    console.log(`🔎 Buscando live ativa para o usuário ID: ${userId}...`);

    // Buscar a live ativa associada ao usuário
    const live = await prisma.live.findUnique({ where: { id: userId } });

    if (!live) {
      console.error(`❌ Nenhuma live ativa encontrada para usuário ID: ${userId}`);
      return NextResponse.json({ error: "Live não encontrada ou offline." }, { status: 404 });
    }

    console.log("✅ Live encontrada no banco:", live);

    return NextResponse.json({
      userId: live.id,
      playbackUrl: live.playbackUrl,
      streamKey: live.streamKey,
      ingestEndpoint: live.ingestEndpoint,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar a live no banco:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
*/