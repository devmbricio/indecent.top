import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Parâmetro de busca inválido" },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Não autenticado" },
      { status: 401 }
    );
  }

  const userId = session.user.id;
  const subscriptionLevel = session.user.subscriptionLevel ?? "free";

  const allowedCategories = {
    premium: ["free", "basic", "premium"],
    basic: ["free", "basic"],
    free: ["free"],
  }[subscriptionLevel];

  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { caption: { contains: query, mode: "insensitive" } },
          { user: { name: { contains: query, mode: "insensitive" } } }, // Busca pelo nome do usuário
        ],
        AND: [
          {
            OR: [
              { category: { in: allowedCategories } },
              { userId },
            ],
          },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: { user: true }, // Inclui informações do usuário relacionado
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}



/* funcional trazendo posts, mas nao tras username
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Parâmetro de busca inválido" },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Não autenticado" },
      { status: 401 }
    );
  }

  const userId = session.user.id;
  const subscriptionLevel = session.user.subscriptionLevel ?? "free";

  const allowedCategories = {
    premium: ["free", "basic", "premium"],
    basic: ["free", "basic"],
    free: ["free"],
  }[subscriptionLevel];

  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { caption: { contains: query, mode: "insensitive" } },
          { user: { username: { contains: query, mode: "insensitive" } } },
        ],
        AND: [
          {
            OR: [
              { category: { in: allowedCategories } },
              { userId },
            ],
          },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
*/
