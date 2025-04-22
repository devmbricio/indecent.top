import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const { productId } = await req.json();

  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  try {
    // Gera o link de afiliado
    const affiliateLink = `/products/${productId}?ref=${session.user.id}`;

    // Salva o link no banco de dados usando `generated_link` conforme esperado pelo Prisma
    const newAffiliateLink = await prisma.affiliateLink.create({
      data: {
        userId: session.user.id,
        productId: productId,
        generated_link: affiliateLink, // Certifique-se de usar `generated_link`
      },
    });

    return NextResponse.json({ affiliateLink: newAffiliateLink.generated_link });
  } catch (error) {
    console.error("Erro ao criar link de afiliado:", error);
    return NextResponse.json({ error: "Erro ao criar link de afiliado" }, { status: 500 });
  }
}

/*
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  try {
    const userId = session.user.id; // Extrair userId da sessão

    // Buscar o link de indicação associado ao cliente
    const referral = await prisma.affiliateClient.findFirst({
      where: { clientId: userId },
      select: { affiliateId: true },
    });

    if (!referral) {
      return NextResponse.json({ error: "Nenhuma referência encontrada." }, { status: 404 });
    }

    return NextResponse.json({ referral }, { status: 200 });
  } catch (error) {
    console.error("Erro ao gerar link de indicação:", error);
    return NextResponse.json({ error: "Erro interno ao gerar link" }, { status: 500 });
  }
}
*/

/*
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  try {
    const referralLink = `${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${session.user.id}`;
    return NextResponse.json({ referralLink }, { status: 200 });
  } catch (error) {
    console.error("Erro ao gerar link de indicação:", error);
    return NextResponse.json({ error: "Erro interno ao gerar link" }, { status: 500 });
  }
}
*/