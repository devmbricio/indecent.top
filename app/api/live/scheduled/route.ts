import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const scheduledLives = await prisma.live.findMany({
      where: {
        status: "scheduled",
      },
      include: {
        user: {
          select: {
            name: true,
            instagram: true,
          },
        },
        guestInfluencer: {
          select: {
            name: true,
            instagram: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });

    if (!scheduledLives.length) {
      return NextResponse.json({ message: "Nenhuma live agendada encontrada." }, { status: 404 });
    }

    return NextResponse.json(
      scheduledLives.map((live) => ({
        id: live.id,
        scheduledAt: live.scheduledAt.toISOString(), // Converter Date para string ISO
        status: live.status,
        guestInstagram: live.guestInstagram || null, // Garantir que não seja undefined
        guestInfluencer: live.guestInfluencer
          ? {
              name: live.guestInfluencer.name,
              instagram: live.guestInfluencer.instagram,
            }
          : null,
        invitedBy: live.user
          ? {
              name: live.user.name,
              instagram: live.user.instagram,
            }
          : null,
      }))
    );
  } catch (error) {
    console.error("Erro ao buscar lives:", error);
    return NextResponse.json({ error: "Erro ao buscar lives." }, { status: 500 });
  }
}


/*
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Certifique-se de que este caminho está correto.

export async function GET(request: NextRequest) {
  try {
    const invites = await prisma.invite.findMany({
      where: { status: "accepted" }, // Apenas convites aceitos para lives agendadas
      orderBy: { scheduledAt: "asc" }, // Ordena pelo horário agendado
      include: {
        invitedBy: true, // Inclui informações do usuário que enviou o convite
      },
    });

    return NextResponse.json(invites);
  } catch (error) {
    console.error("Erro ao buscar lives:", error);
    return NextResponse.json({ message: "Erro ao buscar lives" }, { status: 500 });
  }
}
*/