import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // Obtém a sessão do usuário
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;

    // Obtém o corpo da requisição
    const body = await req.json();
    const { referralId } = body;

    if (!referralId) {
      return NextResponse.json({ error: "Parâmetro referralId ausente" }, { status: 400 });
    }

    // Verifica se o `referredById` já está definido
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { referredById: true },
    });

    if (!user?.referredById) {
      // Atualiza o campo `referredById` apenas se estiver vazio
      await prisma.user.update({
        where: { id: userId },
        data: { referredById: referralId },
      });

      return NextResponse.json({ message: "referredById atualizado com sucesso" }, { status: 200 });
    }

    return NextResponse.json({ message: "referredById já existe" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao processar a solicitação:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
