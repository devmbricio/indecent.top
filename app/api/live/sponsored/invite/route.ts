
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId, duration, guestInstagram, scheduledAt } = await req.json();

    if (!userId || duration <= 0 || !scheduledAt) {
      return NextResponse.json({ error: "Parâmetros inválidos." }, { status: 400 });
    }

    const startTime = new Date(scheduledAt);
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + duration);

    // Verifica se há conflito de horário para o mesmo Instagram
    const conflictingInvite = await prisma.invite.findFirst({
      where: {
        instagram: guestInstagram,
        AND: [
          { scheduledAt: { lte: endTime } },
          { scheduledAt: { gte: startTime } },
        ],
      },
    });

    if (conflictingInvite) {
      return NextResponse.json(
        { error: "Já existe uma live agendada para esse Instagram nesse horário." },
        { status: 400 }
      );
    }

    const inviteCode = Math.random().toString(36).substr(2, 12).toUpperCase();

    // Cria o convite
    const invite = await prisma.invite.create({
      data: {
        userId,
        code: inviteCode,
        instagram: guestInstagram,
        scheduledAt: startTime,
        creditsFrozen: duration,
        invitedById: userId,
      },
    });

    return NextResponse.json({ success: true, inviteCode, scheduledAt: invite.scheduledAt });
  } catch (error: any) {
    console.error("Erro ao criar solicitação de live:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Conflito de chave única detectado." }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro interno ao criar solicitação." }, { status: 500 });
  }
}


/*
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId, duration, guestInstagram, scheduledAt } = await req.json();

    if (!userId || duration <= 0 || !scheduledAt) {
      return NextResponse.json({ error: "Parâmetros inválidos." }, { status: 400 });
    }

    const startTime = new Date(scheduledAt);
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + duration);

    // Verifica se há conflito de horário para o mesmo Instagram
    const conflictingInvite = await prisma.invite.findFirst({
      where: {
        instagram: guestInstagram,
        AND: [
          { scheduledAt: { lte: endTime } },
          { scheduledAt: { gte: startTime } },
        ],
      },
    });

    if (conflictingInvite) {
      return NextResponse.json(
        { error: "Já existe uma live agendada para esse Instagram nesse horário." },
        { status: 400 }
      );
    }

    const inviteCode = Math.random().toString(36).substr(2, 12).toUpperCase();

    // Cria o convite
    const invite = await prisma.invite.create({
      data: {
        userId,
        code: inviteCode,
        instagram: guestInstagram,
        scheduledAt: startTime,
        creditsFrozen: duration,
        invitedById: userId,
      },
    });

    return NextResponse.json({ success: true, inviteCode, scheduledAt: invite.scheduledAt });
  } catch (error: any) {
    console.error("Erro ao criar solicitação de live:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Conflito de chave única detectado." }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro interno ao criar solicitação." }, { status: 500 });
  }
}
*/

/* gera o convite mas nao UUID
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId, duration, guestInstagram, selectedInfluencer, scheduledAt } = await req.json();

    if (!userId || duration <= 0 || !scheduledAt) {
      return NextResponse.json({ error: "Parâmetros inválidos." }, { status: 400 });
    }

    // Verifica se o usuário tem créditos suficientes
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.credits < duration) {
      return NextResponse.json(
        { error: "Créditos insuficientes. Por favor, compre mais créditos." },
        { status: 400 }
      );
    }

    // Verifica se já existe um convite agendado para o mesmo usuário e horário
    const existingInvite = await prisma.invite.findFirst({
      where: {
        userId,
        scheduledAt: new Date(scheduledAt),
      },
    });

    if (existingInvite) {
      return NextResponse.json(
        { error: "Você já tem uma live agendada nesse horário." },
        { status: 400 }
      );
    }

    const inviteCode = Math.random().toString(36).substr(2, 8).toUpperCase();

    // Criação do convite e congelamento dos créditos
    const invite = await prisma.invite.create({
      data: {
        userId,
        code: inviteCode,
        instagram: guestInstagram || null,
        invitedById: userId,
        scheduledAt: new Date(scheduledAt),
        creditsFrozen: duration,
      },
    });

    // Atualiza os créditos do usuário
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: duration } },
    });

    return NextResponse.json({ success: true, inviteCode, scheduledAt: invite.scheduledAt });
  } catch (error: any) {
    console.error("Erro ao criar solicitação de live:", error);

    // Retorna o erro detalhado para análise
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Convite duplicado ou conflito de chave única." },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Erro interno ao criar solicitação." }, { status: 500 });
  }
}
*/