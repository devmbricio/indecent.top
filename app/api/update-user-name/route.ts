import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, name, username } = await req.json();

    if (!userId || !name || !username) {
      return NextResponse.json({ message: "Dados incompletos." }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, username },
    });

    return NextResponse.json({ status: "success", user });
  } catch (error: any) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { message: error.message || "Tente outro nome de usuário." },
      { status: 500 }
    );
  }
}

