import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { env } from "@/env.mjs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession({ req, ...authOptions });
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "productId é obrigatório." }, { status: 400 });
    }

    // Mapeia os créditos com base no ID do produto
    const productCreditsMapping: Record<string, number> = {
      [env.NEXT_PUBLIC_STRIPE_30MIN_ID]: 600,
      [env.NEXT_PUBLIC_STRIPE_100MIN_ID]: 2000,
      [env.NEXT_PUBLIC_STRIPE_300MIN_ID]: 6000,
      [env.NEXT_PUBLIC_STRIPE_500MIN_ID]: 10000,
      [env.NEXT_PUBLIC_STRIPE_1000MIN_ID]: 20000,
    };

    const creditsToAdd = productCreditsMapping[productId];
    if (!creditsToAdd) {
      return NextResponse.json({ error: "Produto inválido." }, { status: 400 });
    }

    // Criação da sessão de checkout do Stripe
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: productId, quantity: 1 }],
      mode: "payment",
      success_url: `${env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/cancel`,
      metadata: { userId, creditsToAdd },
    });

    return NextResponse.json({ url: stripeSession.url }, { status: 200 });
  } catch (error) {
    console.error("Erro na API de créditos (POST):", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}

/* funcional mas nao credita as compas no credits db
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function GET(req: Request) {
  try {
    const session = await getServerSession({ req, ...authOptions });
    if (!session || !session.user?.id) {
      console.error("Unauthorized access: No valid session.");
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user) {
      console.error("User not found:", userId);
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
    }

    console.log("User credits retrieved:", user.credits);
    return NextResponse.json({ credits: user.credits }, { status: 200 });
  } catch (error) {
    console.error("Erro na API de créditos (GET):", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const session = await getServerSession({ req, ...authOptions });
    if (!session || !session.user?.id) {
      console.error("Unauthorized access: No valid session.");
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;

    const body = await req.json();
    const { deduct = 0, reward = 0, productId } = body;

    if (productId) {
      const priceId = productId;
      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      });

      return NextResponse.json({ url: stripeSession.url }, { status: 200 });
    }

    // Atualizar créditos do usuário
    const updatedCredits = await prisma.user.update({
      where: { id: userId },
      data: {
        credits: { decrement: deduct, increment: reward },
      },
    });

    // Verificar se o cliente está associado a um afiliado e adicionar comissão
    const referral = await prisma.affiliateClient.findFirst({
      where: { clientId: userId },
      select: { affiliateId: true },
    });

    if (referral) {
      const commission = (reward || deduct) * 0.01;
      await prisma.user.update({
        where: { id: referral.affiliateId },
        data: { credits: { increment: commission } },
      });
    }

    return NextResponse.json({ credits: updatedCredits.credits }, { status: 200 });
  } catch (error) {
    console.error("Erro na API de créditos (POST):", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
*/
/*


import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function GET(req: Request) {
  try {
    const session = await getServerSession({ req, ...authOptions });
    if (!session || !session.user?.id) {
      console.error("Unauthorized access: No valid session.");
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user) {
      console.error("User not found:", userId);
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
    }

    console.log("User credits retrieved:", user.credits);
    return NextResponse.json({ credits: user.credits }, { status: 200 });
  } catch (error) {
    console.error("Erro na API de créditos (GET):", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession({ req, ...authOptions });
    if (!session || !session.user?.id) {
      console.error("Unauthorized access: No valid session.");
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;

    const body = await req.json();
    const { deduct, reward, productId } = body;

    if (productId) {
      const priceId = productId;
      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      });

      return NextResponse.json({ url: stripeSession.url }, { status: 200 });
    }

    const updatedCredits = await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: deduct || 0, increment: reward || 0 } },
    });

    return NextResponse.json({ credits: updatedCredits.credits }, { status: 200 });
  } catch (error) {
    console.error("Erro na API de créditos (POST):", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
*/

/*


"use server"

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.id) {
    return res.status(401).json({ message: "Não autorizado" });
  }

  const userId = session.user.id;

  try {
    if (req.method === "GET") {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { credits: true },
      });

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      return res.status(200).json({ credits: user.credits });
    }

    if (req.method === "POST") {
      const { deduct, reward, productId } = req.body;

      if (productId) {
        const priceId = productId;
        const stripeSession = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [{ price: priceId, quantity: 1 }],
          mode: "payment",
          success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
        });

        return res.status(200).json({ url: stripeSession.url });
      }

      const updatedCredits = await prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: deduct || 0, increment: reward || 0 } },
      });

      return res.status(200).json({ credits: updatedCredits.credits });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: `Método ${req.method} não permitido` });
  } catch (error) {
    console.error("Erro na API de créditos:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
*/