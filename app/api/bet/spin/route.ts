import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AffiliateRole, InfluencerRole } from "@prisma/client";

const ADMIN_ID = process.env.INDECENT_ADMINISTRADOR!;
const MAX_RETRIES = 3;

function getRandomResult(): number[] {
  return Array.from({ length: 5 }, () => Math.floor(Math.random() * 13));
}

function calculatePrize(numbers: number[]): { prize: number, isJackpot: boolean } {
  const isJackpot = numbers.every((n) => n === 9);
  if (isJackpot) return { prize: 0, isJackpot: true };

  let count = 1;
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] === numbers[i - 1]) {
      count++;
    } else {
      break; // só conta sequência inicial
    }
  }

  // Recompensas reduzidas pela metade
  if (count === 5) return { prize: 50, isJackpot: false };  // antes 100
  if (count === 4) return { prize: 25, isJackpot: false };  // antes 50
  if (count === 3) return { prize: 10, isJackpot: false };  // antes 20
  if (count === 2) return { prize: 2, isJackpot: false };   // antes 5

  return { prize: 0, isJackpot: false };
}


export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const viewerId = session.user.id;
  const [viewer, admin] = await Promise.all([
    prisma.user.findUnique({ where: { id: viewerId } }),
    prisma.user.findUnique({ where: { id: ADMIN_ID } }),
  ]);

  if (!viewer || !admin) {
    return NextResponse.json({ error: "Usuário ou Admin não encontrado." }, { status: 404 });
  }

  if (viewer.credits < 1) {
    return NextResponse.json({ error: "Créditos insuficientes" }, { status: 403 });
  }

  const result = getRandomResult();
  const { prize, isJackpot } = calculatePrize(result);

  const baseBet = 1;
  const jackpotShare = baseBet * 0.1;
  const adminShare = baseBet * 0.5;
  const influencerShare = baseBet * 0.3;
  const affiliateShare = baseBet * 0.1;

  const hasAffiliate = viewer.affiliate === AffiliateRole.AFFILIATE;
  const hasInfluencer = viewer.influencer === InfluencerRole.INFLUENCER;

  const affiliateReceiverId = hasAffiliate ? viewer.id : null;
  const influencerReceiverId = hasInfluencer ? viewer.id : null;

  let attempts = 0;
  while (attempts < MAX_RETRIES) {
    try {
      const jackpotBefore = await prisma.jackpot.findUnique({ where: { id: "jackpot" } });
      const jackpotAmount = jackpotBefore?.total ?? 0;

      const txs = [
        // 1. Deduz 1 crédito do usuário
        prisma.user.update({
          where: { id: viewer.id },
          data: { credits: { decrement: 1 } },
        }),

        // 2. Admin recebe 50%
        prisma.user.update({
          where: { id: admin.id },
          data: { credits: { increment: adminShare } },
        }),

        // 3. Afiliado recebe 10%
        ...(affiliateReceiverId
          ? [
              prisma.user.update({
                where: { id: affiliateReceiverId },
                data: { credits: { increment: affiliateShare } },
              }),
            ]
          : []),

        // 4. Influencer recebe 30%
        ...(influencerReceiverId
          ? [
              prisma.user.update({
                where: { id: influencerReceiverId },
                data: { credits: { increment: influencerShare } },
              }),
            ]
          : []),

        // 5. Acumula 10% no Jackpot
        prisma.jackpot.upsert({
          where: { id: "jackpot" },
          update: { total: { increment: jackpotShare } },
          create: { id: "jackpot", total: jackpotShare },
        }),

        // 6. Se ganhar (e não for jackpot), credita o prêmio
        ...(prize > 0 && !isJackpot
          ? [
              prisma.user.update({
                where: { id: viewer.id },
                data: { credits: { increment: prize } },
              }),
            ]
          : []),

        // 7. Se for jackpot, entrega o valor acumulado e zera
        ...(isJackpot && jackpotAmount > 0
          ? [
              prisma.user.update({
                where: { id: viewer.id },
                data: { credits: { increment: jackpotAmount } },
              }),
              prisma.jackpot.update({
                where: { id: "jackpot" },
                data: { total: 0 },
              }),
            ]
          : []),
      ];

      await prisma.$transaction(txs);

      const updatedViewer = await prisma.user.findUnique({ where: { id: viewerId } });
      const jackpotAfter = await prisma.jackpot.findUnique({ where: { id: "jackpot" } });

      return NextResponse.json({
        result,
        prize,
        isJackpot,
        updatedCredits: updatedViewer?.credits ?? 0,
        dailyWins: prize > 0 ? prize : isJackpot ? jackpotAmount : 0,
        jackpotTotal: jackpotAfter?.total ?? 0,
      });
    } catch (error) {
      attempts++;
      console.error(`[spin] Erro tentativa ${attempts}:`, error);

      if (attempts >= MAX_RETRIES) {
        return NextResponse.json(
          { error: "Falha ao processar aposta. Tente novamente." },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
}
