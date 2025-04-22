import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
  }

  try {
    const userId = session.user.id;

    // Verifica se o usuário já tem um referralId
    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: { referralId: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    if (!user.referralId) {
      const referralId = `ref_${Math.random().toString(36).substring(2, 10)}`;
      user = await prisma.user.update({
        where: { id: userId },
        data: { referralId },
      });
    }

    const referralUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/signin?ref=${user.referralId}`;

    return NextResponse.json({ referralUrl });
  } catch (error) {
    console.error("Erro ao gerar link de referral:", error);
    return NextResponse.json({ error: "Erro ao gerar link de referral" }, { status: 500 });
  }
}



/*
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
  }

  try {
    const userId = session.user.id;

    // Verifica se o usuário tem o papel de afiliado
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { affiliate: true, referralId: true },
    });

    if (!user || user.affiliate !== "AFFILIATE") {
      return NextResponse.json({ error: "Apenas afiliados podem gerar links de referência" }, { status: 403 });
    }

    // Garante que o usuário tenha um referralId único
    let referralId = user.referralId;
    if (!referralId) {
      referralId = `ref_${Math.random().toString(36).substring(2, 10)}`;
      await prisma.user.update({
        where: { id: userId },
        data: { referralId },
      });
    }

    // Gera o URL de referral
    const referralUrl = `${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${referralId}`;

    return NextResponse.json({ referralUrl });
  } catch (error) {
    console.error("Erro ao gerar URL de referral:", error);
    return NextResponse.json({ error: "Erro interno ao gerar URL" }, { status: 500 });
  }
}
*/