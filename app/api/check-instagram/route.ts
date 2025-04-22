import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const instagram = searchParams.get("instagram");

    if (!instagram) {
      return NextResponse.json({ error: "Parâmetro 'instagram' é obrigatório." }, { status: 400 });
    }

    // Verifica se o Instagram já existe no banco de dados
    const existingInvite = await prisma.invite.findFirst({
      where: { instagram },
    });

    return NextResponse.json({ exists: !!existingInvite, instagram });
  } catch (error) {
    console.error("Erro ao verificar Instagram:", error);
    return NextResponse.json({ error: "Erro interno ao verificar Instagram." }, { status: 500 });
  }
}
