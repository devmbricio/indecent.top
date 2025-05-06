// app/api/powerball/update-jackpot/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const response = await fetch("https://api.powerball.com/jackpot");
    const data = await response.json();

    const estimatedJackpot = data.estimatedJackpot;
    const cashValue = data.cashValue;
    const nextDrawDate = new Date(data.nextDrawDate);

    const existing = await prisma.jackpotInfo.findFirst({
      where: { nextDrawDate },
    });

    if (existing) {
      await prisma.jackpotInfo.update({
        where: { id: existing.id },
        data: { estimatedJackpot, cashValue },
      });
    } else {
      await prisma.jackpotInfo.create({
        data: {
          estimatedJackpot,
          cashValue,
          nextDrawDate,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao atualizar Jackpot:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar informações do Jackpot" },
      { status: 500 }
    );
  }
}

