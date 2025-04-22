import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AffiliateRole, InfluencerRole } from "@prisma/client";

const ADMIN_ID = process.env.INDECENT_ADMINISTRADOR;
const MAX_RETRIES = 3;

export async function POST(request: Request) {
  try {
    console.log("[distribute-credits] Iniciando rota...");
    const { viewerId, influencerId } = await request.json();

    if (!viewerId) {
      console.log("[distribute-credits] Erro: viewerId não fornecido.");
      return NextResponse.json({ error: "viewerId é obrigatório." }, { status: 400 });
    }

    if (!ADMIN_ID) {
      console.log("[distribute-credits] Erro: ADMIN_ID não configurado.");
      return NextResponse.json({ error: "ADMIN_ID não configurado." }, { status: 500 });
    }

    const [viewer, admin, influencer] = await Promise.all([
      prisma.user.findUnique({ where: { id: viewerId } }),
      prisma.user.findUnique({ where: { id: ADMIN_ID } }),
      influencerId ? prisma.user.findUnique({ where: { id: influencerId } }) : null,
    ]);

    if (!viewer) return NextResponse.json({ error: "Viewer não encontrado." }, { status: 404 });
    if (!admin) return NextResponse.json({ error: "Administrador não encontrado." }, { status: 500 });

    const accumulated = viewer.accumulativeCredits ?? 0;
    if (accumulated <= 0) {
      console.log("[distribute-credits] Nada a distribuir.");
      return NextResponse.json({ message: "Nada a distribuir." }, { status: 200 });
    }

    const influencerShare = accumulated * 0.7;
    const adminShareBase = accumulated * 0.2;
    const affiliateShare = accumulated * 0.1;

    const influencerReceiverId =
      influencer && influencer.influencer === InfluencerRole.INFLUENCER
        ? influencer.id
        : admin.id;

    const hasAffiliate = viewer.affiliate === AffiliateRole.AFFILIATE;
    const affiliateReceiverId = hasAffiliate ? viewer.id : admin.id;

    const adminGetsExtra = !hasAffiliate;
    const finalAdminShare = adminGetsExtra
      ? adminShareBase + affiliateShare
      : adminShareBase;

    console.log("[distribute-credits] Iniciando distribuição...", {
      viewerId,
      accumulated,
      influencerReceiverId,
      affiliateReceiverId,
      adminId: admin.id,
      influencerShare,
      affiliateShare: hasAffiliate ? affiliateShare : 0,
      adminShare: finalAdminShare,
    });

    let attempts = 0;
    while (attempts < MAX_RETRIES) {
      try {
        const transactions = [
          // Zera os créditos acumulados do viewer
          prisma.user.update({
            where: { id: viewer.id },
            data: { accumulativeCredits: 0 },
          }),

          // Credita 70% para o influenciador
          prisma.user.update({
            where: { id: influencerReceiverId },
            data: { credits: { increment: influencerShare } },
          }),

          // Credita 10% para o afiliado (ou para admin se não houver)
          ...(hasAffiliate
            ? [
                prisma.user.update({
                  where: { id: affiliateReceiverId },
                  data: { credits: { increment: affiliateShare } },
                }),
              ]
            : []),

          // Admin sempre recebe pelo menos 20% ou até 30% se não houver afiliado
          prisma.user.update({
            where: { id: admin.id },
            data: { credits: { increment: finalAdminShare } },
          }),
        ];

        await prisma.$transaction(transactions);

        console.log("[distribute-credits] Distribuição concluída com sucesso.");
        return NextResponse.json({
          message: `Distribuídos ${accumulated} créditos.`,
        });
      } catch (error: any) {
        attempts++;
        console.error(`[distribute-credits] Erro na tentativa ${attempts}:`, error);

        if (attempts >= MAX_RETRIES) {
          console.error("[distribute-credits] Falha após múltiplas tentativas.");
          return NextResponse.json(
            { error: "Falha ao distribuir créditos após várias tentativas." },
            { status: 500 }
          );
        }

        console.warn(`[distribute-credits] Tentando novamente...`);
      }
    }
  } catch (error) {
    console.error("[distribute-credits] Erro inesperado:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}


/*
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AffiliateRole, InfluencerRole } from "@prisma/client";

const ADMIN_ID = process.env.INDECENT_ADMINISTRADOR;

export async function POST(request: Request) {
  try {
    console.log("[distribute-credits] Iniciando rota...");
    const { viewerId, influencerId } = await request.json();
    console.log(
      "[distribute-credits] Parâmetros recebidos:",
      "viewerId =", viewerId,
      "influencerId =", influencerId
    );

    if (!viewerId) {
      console.log("[distribute-credits] Erro: viewerId não fornecido.");
      return NextResponse.json({ error: "viewerId é obrigatório." }, { status: 400 });
    }
    if (!ADMIN_ID) {
      console.log("[distribute-credits] Erro: ADMIN_ID não configurado.");
      return NextResponse.json({ error: "ADMIN_ID não configurado." }, { status: 500 });
    }

    const [viewer, admin, influencer] = await Promise.all([
      prisma.user.findUnique({ where: { id: viewerId } }),
      prisma.user.findUnique({ where: { id: ADMIN_ID } }),
      influencerId
        ? prisma.user.findUnique({ where: { id: influencerId } })
        : null,
    ]);

    console.log("[distribute-credits] viewer =", viewer);
    console.log("[distribute-credits] admin =", admin);
    console.log("[distribute-credits] influencer =", influencer);

    if (!viewer) {
      console.log("[distribute-credits] Viewer não encontrado no banco.");
      return NextResponse.json({ error: "Viewer não encontrado." }, { status: 404 });
    }
    if (!admin) {
      console.log("[distribute-credits] Admin não encontrado no banco.");
      return NextResponse.json({ error: "Administrador não encontrado." }, { status: 500 });
    }

    const accumulated = viewer.accumulativeCredits ?? 0;
    console.log("[distribute-credits] accumulated =", accumulated);

    if (accumulated <= 0) {
      console.log("[distribute-credits] Nada a distribuir.");
      return NextResponse.json({ message: "Nada a distribuir." }, { status: 200 });
    }

    const influencerShare = accumulated * 0.7;
    const affiliateShare = accumulated * 0.2;
    const adminShare = accumulated * 0.1;

    let influencerReceiverId = admin.id;
    if (influencer && influencer.influencer === InfluencerRole.INFLUENCER) {
      influencerReceiverId = influencer.id;
    }

    let affiliateReceiverId = admin.id;
    if (viewer.affiliate === AffiliateRole.AFFILIATE) {
      affiliateReceiverId = viewer.id;
    }

    console.log("[distribute-credits] Iniciando transaction =>", {
      influencerReceiverId,
      affiliateReceiverId,
      adminId: admin.id,
    });

    await prisma.$transaction([
      // (1) Zerar accumulativeCredits do viewer
      prisma.user.update({
        where: { id: viewer.id },
        data: { accumulativeCredits: 0 },
      }),
      // (2) 70%
      prisma.user.update({
        where: { id: influencerReceiverId },
        data: { credits: { increment: influencerShare } },
      }),
      // (3) 20%
      prisma.user.update({
        where: { id: affiliateReceiverId },
        data: { credits: { increment: affiliateShare } },
      }),
      // (4) 10%
      prisma.user.update({
        where: { id: admin.id },
        data: { credits: { increment: adminShare } },
      }),
    ]);

    console.log("[distribute-credits] Distribuição concluída com sucesso.");

    return NextResponse.json({
      message: `Distribuídos ${accumulated} créditos.`,
    });
  } catch (error) {
    console.error("[distribute-credits] Erro:", error);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}
*/
