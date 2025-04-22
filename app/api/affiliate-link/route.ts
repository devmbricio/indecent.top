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
    // Codifique o título do produto para URL
    const encodedProductId = encodeURIComponent(productId);

    // Gera o link de afiliado
    const affiliateLink = `${process.env.NEXT_PUBLIC_APP_URL}/products/${encodedProductId}?ref=${session.user.id}`;

    // Salva o link no banco de dados usando `generated_link`
    const newAffiliateLink = await prisma.affiliateLink.create({
      data: {
        userId: session.user.id,
        productId: productId,
        generated_link: affiliateLink,
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
*/

/*
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
  }

  const { productId } = await req.json();

  if (!productId) {
    return NextResponse.json({ error: "ID do produto é obrigatório" }, { status: 400 });
  }

  try {
    const userId = session.user.id;

    // Verifica se o produto existe
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    // Gera o link de afiliado
    const affiliateLink = `${process.env.NEXT_PUBLIC_APP_URL}/products/${productId}?ref=${userId}`;

    // Salva o link no banco de dados
    const newAffiliateLink = await prisma.affiliateLink.create({
      data: {
        userId,
        productId,
        generated_link: affiliateLink,
      },
    });

    return NextResponse.json({ affiliateLink: newAffiliateLink.generated_link });
  } catch (error) {
    console.error("Erro ao criar link de afiliado:", error);
    return NextResponse.json({ error: "Erro ao criar link de afiliado" }, { status: 500 });
  }
}
*/

/*
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
*/


/*
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth"; // Caminho do arquivo de opções de autenticação

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
    // Verifica o produto
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Gera o link de afiliado
    const affiliateLink = `${product.affiliateLink}?ref=${session.user.id}`;

    // Salva o link no banco de dados
    const newAffiliateLink = await prisma.affiliateLink.create({
      data: {
        userId: session.user.id,  // Corrigido para userId
        productId: productId,     // Corrigido para productId
        generated_link: affiliateLink,
      },
    });

    return NextResponse.json({ affiliateLink: newAffiliateLink.generated_link });
  } catch (error) {
    console.error("Erro ao criar link de afiliado:", error);
    return NextResponse.json({ error: "Erro ao criar link de afiliado" }, { status: 500 });
  }
}
*/
/*

// app/api/affiliate-link/create/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth"; // Caminho do arquivo de opções de autenticação

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
    // Verifica o produto
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Gera o link de afiliado
    const affiliateLink = `${product.affiliateLink}?ref=${session.user.id}`;

    // Salva o link no banco de dados
    const newAffiliateLink = await prisma.affiliateLink.create({
      data: {
        user_id: session.user.id,
        product_id: productId,
        generated_link: affiliateLink,
      },
    });

    return NextResponse.json({ affiliateLink: newAffiliateLink.generated_link });
  } catch (error) {
    console.error("Erro ao criar link de afiliado:", error);
    return NextResponse.json({ error: "Erro ao criar link de afiliado" }, { status: 500 });
  }
}
*/