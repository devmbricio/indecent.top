import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 🔹 Correção: Usamos export named `GET` em vez de `export default`
export async function GET(req: NextRequest) {
  try {
    // 🔹 Buscar apenas usuários com "AFFILIATE" ou "INFLUENCER"
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { affiliate: "AFFILIATE" },
          { influencer: "INFLUENCER" },
        ],
      },
      select: {
        id: true,
        name: true,
        image: true,
        referralId: true,
        affiliate: true,
        influencer: true,
        _count: {
          select: {
            posts: true,
            likes: true,
            comments: true,
            // 🔹 Atualizado para contar o número de lives hospedadas
            livesHosted: true, // Se 'lives' estiver relacionado ao campo 'livesHosted'
          },
        },
      },
    });

    // 🔹 Calcular a pontuação de cada usuário
    const scoredUsers = users.map((user) => {
      const score =
        (user._count.likes || 0) +
        (user._count.posts || 0) * 2 +
        (user._count.livesHosted || 0) * 10 + // Ajustado para 'livesHosted'
        (user._count.comments || 0) * 2;

      return { ...user, score };
    });

    // 🔹 Ordenar por pontuação e selecionar os Top 10
    const rankedUsers = scoredUsers.sort((a, b) => b.score - a.score).slice(0, 20);

    // 🔹 Atualizar o ranking no banco de dados
    await prisma.$transaction(
      rankedUsers.map((user, index) =>
        prisma.topProfile.upsert({
          where: { userId: user.id },
          update: { score: user.score, rank: index + 1 },
          create: { userId: user.id, score: user.score, rank: index + 1 },
        })
      )
    );

    // 🔹 Retornar os 10 melhores usuários com "AFFILIATE" ou "INFLUENCER"
    return NextResponse.json(
      rankedUsers.map((user, index) => ({
        id: user.id,
        name: user.name,
        image: user.image,
        referralId: user.referralId,
        score: user.score,
        rank: index + 1,
        affiliate: user.affiliate,
        influencer: user.influencer,
      }))
    );
  } catch (error) {
    console.error("Erro ao calcular ranking:", error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}

/*import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 🔹 Correção: Usamos export named `GET` em vez de `export default`
export async function GET(req: NextRequest) {
  try {
    // 🔹 Buscar apenas usuários com "AFFILIATE" ou "INFLUENCER"
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { affiliate: "AFFILIATE" },
          { influencer: "INFLUENCER" },
        ],
      },
      select: {
        id: true,
        name: true,
        image: true,
        referralId: true,
        affiliate: true,
        influencer: true,
        _count: {
          select: {
            posts: true,
            likes: true,
            comments: true,
            lives: true,
          },
        },
      },
    });

    // 🔹 Calcular a pontuação de cada usuário
    const scoredUsers = users.map((user) => {
      const score =
        (user._count.likes || 0) +
        (user._count.posts || 0) * 2 +
        (user._count.lives || 0) * 10 +
        (user._count.comments || 0) * 2;

      return { ...user, score };
    });

    // 🔹 Ordenar por pontuação e selecionar os Top 10
    const rankedUsers = scoredUsers.sort((a, b) => b.score - a.score).slice(0, 10);

    // 🔹 Atualizar o ranking no banco de dados
    await prisma.$transaction(
      rankedUsers.map((user, index) =>
        prisma.topProfile.upsert({
          where: { userId: user.id },
          update: { score: user.score, rank: index + 1 },
          create: { userId: user.id, score: user.score, rank: index + 1 },
        })
      )
    );

    // 🔹 Retornar os 10 melhores usuários com "AFFILIATE" ou "INFLUENCER"
    return NextResponse.json(
      rankedUsers.map((user, index) => ({
        id: user.id,
        name: user.name,
        image: user.image,
        referralId: user.referralId,
        score: user.score,
        rank: index + 1,
        affiliate: user.affiliate,
        influencer: user.influencer,
      }))
    );
  } catch (error) {
    console.error("Erro ao calcular ranking:", error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
*/
