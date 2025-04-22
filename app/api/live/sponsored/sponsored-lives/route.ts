import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Parâmetro 'userId' é obrigatório." }, { status: 400 });
    }

    // Consulta no banco de dados para buscar as lives patrocinadas pelo usuário
    const sponsoredLives = await prisma.invite.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        code: true,
        scheduledAt: true,
        status: true,
        instagram: true,
        invitedBy: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "desc",
      },
    });

    return NextResponse.json(sponsoredLives);
  } catch (error) {
    console.error("Erro ao buscar lives patrocinadas:", error);
    return NextResponse.json({ error: "Erro interno ao buscar lives patrocinadas." }, { status: 500 });
  }
}
