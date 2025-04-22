import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "ID do usuário é obrigatório." }, { status: 400 });
    }

    // 🔥 Atualiza status para "active"
    const updatedLive = await prisma.live.update({
      where: { id: userId },
      data: { status: "active", updatedAt: new Date() },
    });

    return NextResponse.json(updatedLive);
  } catch (error) {
    console.error("❌ Erro ao iniciar live:", error);
    return NextResponse.json({ error: "Erro ao iniciar a live." }, { status: 500 });
  }
}
