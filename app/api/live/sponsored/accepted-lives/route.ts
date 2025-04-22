import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const lives = await prisma.invite.findMany({
      where: {
        redeemedById: userId,
        status: "accepted",
      },
      orderBy: { scheduledAt: "asc" },
    });

    return NextResponse.json(lives);
  } catch (error) {
    console.error("Erro ao buscar lives:", error);
    return NextResponse.json({ error: "Erro ao buscar lives" }, { status: 500 });
  }
}
