import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const { score, moveCount } = body;

  if (typeof score !== "number" || typeof moveCount !== "number") {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        credits: {
          decrement: moveCount,
        },
      },
    });

    await prisma.move.create({
      data: {
        userId: user.id,
        score,
        moveCount,
        createdAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, updatedCredits: user.credits });
  } catch (err) {
    console.error("Erro ao registrar movimento:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
