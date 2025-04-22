import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ajuste o caminho conforme necessário

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "ID do usuário não fornecido." }, { status: 400 });
    }

    console.log(`📡 Buscando detalhes da live para o usuário ID: ${userId}`);

    // ✅ Recupera a live ativa do usuário no banco de dados
    const live = await prisma.live.findFirst({
      where: { userId },
      select: { streamKey: true, ingestEndpoint: true },
    });

    if (!live) {
      return NextResponse.json({ error: "Nenhuma live ativa encontrada para este usuário." }, { status: 404 });
    }

    const { streamKey, ingestEndpoint } = live;

    if (!streamKey || !ingestEndpoint) {
      return NextResponse.json({ error: "StreamKey ou ingestEndpoint ausentes." }, { status: 400 });
    }

    console.log(`✅ StreamKey encontrada: ${streamKey}`);
    console.log(`✅ Ingest Endpoint encontrado: ${ingestEndpoint}`);

    return NextResponse.json({
      success: true,
      streamKey,
      ingestEndpoint,
      message: "Detalhes da transmissão obtidos.",
    });
  } catch (error) {
    console.error("❌ Erro ao buscar detalhes da live:", error);
    return NextResponse.json({ error: "Erro ao processar a requisição" }, { status: 500 });
  }
}
