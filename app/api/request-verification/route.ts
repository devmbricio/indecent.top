import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json(
      { error: "Parâmetros inválidos" },
      { status: 400 }
    );
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { verifiedProfile: "VERIFIED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao solicitar verificação:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
