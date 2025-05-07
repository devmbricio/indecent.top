import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId, role } = await req.json();
    if (!userId || !role) {
      return NextResponse.json({ error: "ID do usuário e função são obrigatórios." }, { status: 400 });
    }

    console.log(`🔎 Buscando palco do usuário ID: ${userId}...`);
    const live = await prisma.live.findUnique({
      where: { id: userId },
    });

    if (!live) {
      console.error("❌ Nenhum palco encontrado.");
      return NextResponse.json({ error: "Palco não encontrado." }, { status: 404 });
    }

    console.log("✅ Palco encontrado. Gerando token...");

    // 🔥 Fazendo requisição REST para a API do IVS Real-Time
    const response = await fetch(`https://ivs.us-east-1.amazonaws.com/CreateParticipantToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Amz-Date": new Date().toISOString(),
        Authorization: `AWS ${process.env.AWS_AWS_ACCESS_KEY_ID}:${process.env.AWS_AWS_SECRET_ACCESS_KEY}`,
      },
      body: JSON.stringify({
        stageArn: live.stageArn,
        duration: 600, // Token válido por 10 minutos
        attributes: {
          role: role === "host" ? "host" : "viewer",
        },
      }),
    });

    const data = await response.json();

    if (!data.token) {
      console.error("❌ Erro ao gerar token.");
      return NextResponse.json({ error: "Falha ao gerar token." }, { status: 500 });
    }

    console.log("✅ Token gerado:", data.token);
    return NextResponse.json({ token: data.token });
  } catch (error) {
    console.error("❌ Erro ao gerar token:", error);
    return NextResponse.json({ error: "Erro ao gerar token de participante." }, { status: 500 });
  }
}
