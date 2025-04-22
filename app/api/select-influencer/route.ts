import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    console.log("🔎 Buscando influenciadores...");
    
    const influencers = await prisma.user.findMany({
      where: { influencer: "INFLUENCER" },
      select: { id: true, name: true, instagram: true },
    });

    if (!influencers.length) {
      return NextResponse.json({ message: "Nenhum influenciador encontrado." }, { status: 404 });
    }

    console.log(`✅ ${influencers.length} influenciadores encontrados.`);
    return NextResponse.json(influencers);
  } catch (error) {
    console.error("❌ Erro ao buscar influenciadores:", error);
    return NextResponse.json({ error: "Erro ao buscar influenciadores." }, { status: 500 });
  }
}
