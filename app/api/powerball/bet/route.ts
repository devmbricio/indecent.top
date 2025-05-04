import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    const { mainNumbers, powerballNumber, quantity = 1 } = await request.json();
    const betCost = quantity * 2; // Custo por aposta (ajuste conforme necessário)

    if (
      !Array.isArray(mainNumbers) ||
      mainNumbers.length !== 5 ||
      !mainNumbers.every((num) => Number.isInteger(num) && num > 0 && num <= 69) ||
      !Number.isInteger(powerballNumber) ||
      powerballNumber < 1 ||
      powerballNumber > 26 ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return NextResponse.json({ success: false, message: "Dados de aposta inválidos." }, { status: 400 });
    }

    // 1. Buscar os créditos atuais do usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user || user.credits < betCost) {
      return NextResponse.json({ success: false, message: "Créditos insuficientes." }, { status: 400 });
    }

    // 2. Criar o registro da aposta
    const bet = await prisma.bet.create({
      data: {
        userId,
        mainNumbers,
        powerballNumber,
        quantity,
        createdAt: new Date(),
      },
    });

    // 3. Atualizar os créditos do usuário
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { credits: user.credits - betCost },
      select: { credits: true },
    });

    return NextResponse.json({ success: true, message: "Aposta realizada com sucesso!", updatedCredits: updatedUser.credits, bet });
  } catch (error) {
    console.error("Erro ao processar a aposta:", error);
    return NextResponse.json({ success: false, message: "Erro ao processar a aposta." }, { status: 500 });
  }
}

// Se você também suportar o método GET (por exemplo, para buscar informações da aposta),
// adicione uma função export async function GET(request: Request) { ... }