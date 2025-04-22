import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { callId, userId, invitedById } = await req.json();

    if (!callId || !userId || !invitedById) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const invite = await prisma.invite.create({
      data: {
        callId,
        userId,
        invitedById,
        scheduledAt: new Date(), // Preenche com a data atual
        status: "pending",       // Define o status inicial
      },
    });

    return NextResponse.json(invite, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar convite:", error.message);
    return NextResponse.json({ error: "Erro ao criar convite" }, { status: 500 });
  }
}
