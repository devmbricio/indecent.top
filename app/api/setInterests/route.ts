import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
    }

    const { interests } = await req.json();

    if (!interests || !Array.isArray(interests) || interests.length < 3) {
      return NextResponse.json({ error: "Selecione pelo menos 3 interesses." }, { status: 400 });
    }

    console.log("🔹 Buscando IDs dos interesses...");
    const existingInterests = await prisma.interest.findMany({
      where: { name: { in: interests } },
      select: { id: true, name: true },
    });

    if (!existingInterests.length) {
      return NextResponse.json({ error: "Nenhum dos interesses fornecidos foi encontrado no banco." }, { status: 400 });
    }

    console.log("✅ Interesses válidos encontrados:", existingInterests);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    console.log("🔹 Removendo interesses antigos do usuário...");
    await prisma.userInterest.deleteMany({
      where: { userId: user.id },
    });

    console.log("🔹 Adicionando novos interesses ao usuário...");
    await prisma.userInterest.createMany({
      data: existingInterests.map((interest) => ({
        userId: user.id,
        interestId: interest.id,
      })),
    });

    console.log("✅ Interesses atualizados no banco!");

    return NextResponse.json({ message: "Interesses salvos com sucesso!" }, { status: 200 });

  } catch (error) {
    console.error("🚨 Erro ao atualizar interesses:", error);
    return NextResponse.json({ error: "Erro ao salvar os interesses." }, { status: 500 });
  }
}
