// app/api/powerball/jackpot-info/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const jackpot = await prisma.jackpotInfo.findFirst({
      orderBy: {
        nextDrawDate: "desc",
      },
    });

    if (!jackpot) {
      return NextResponse.json({ error: "Nenhuma informação de jackpot encontrada" }, { status: 404 });
    }

    return NextResponse.json({
      estimatedJackpot: jackpot.estimatedJackpot,
      cashValue: jackpot.cashValue,
      nextDrawDate: jackpot.nextDrawDate,
    });
  } catch (error: any) {
    console.error("Erro ao buscar informações do jackpot no banco:", error.message);
    return NextResponse.json({ error: "Erro ao buscar informações do jackpot" }, { status: 500 });
  }
}

