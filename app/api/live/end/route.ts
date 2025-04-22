import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { IvsClient, StopStreamCommand } from "@aws-sdk/client-ivs";

const prisma = new PrismaClient();
const ivsClient = new IvsClient({ region: process.env.AWS_REGION! });

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "ID do usuário é obrigatório." }, { status: 400 });
    }

    const live = await prisma.live.findUnique({ where: { id: userId } });
    if (!live) {
      return NextResponse.json({ error: "Live não encontrada." }, { status: 404 });
    }

    console.log(`⏹️ Encerrando transmissão para usuário ${userId}...`);
    await ivsClient.send(new StopStreamCommand({ channelArn: live.arn }));

    await prisma.live.update({
      where: { id: userId },
      data: { status: "ended" },
    });

    console.log("✅ Transmissão encerrada.");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Erro ao encerrar a live:", error);
    return NextResponse.json({ error: "Erro ao encerrar a live." }, { status: 500 });
  }
}
