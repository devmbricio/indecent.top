import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, job } = body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { job },
    });

    return NextResponse.json({ success: true, job: updatedUser.job }, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar job:", error);
    return NextResponse.json({ error: "Erro ao atualizar job." }, { status: 500 });
  }
}

export const runtime = "nodejs"; // Opcional: usa nodejs no ambiente se necessário





/*
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // Importe seu cliente Prisma

// Função para lidar com a atualização do job
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { userId, job }: { userId: string; job: "USER" | "JOB" } = req.body; // Use as strings literais para JobRole

  if (!userId || !job) {
    return res.status(400).json({ error: "Parâmetros inválidos." });
  }

  try {
    // Atualiza o campo "job" do usuário no banco de dados
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { job }, // Atualiza o campo "job"
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Erro ao atualizar job:", error);
    return res.status(500).json({ error: "Erro ao atualizar job." });
  }
}
*/