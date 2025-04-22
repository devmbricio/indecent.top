import { NextApiRequest, NextApiResponse } from "next";
import { fetchUserCredits } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 });
  }

  try {
    // Exemplo de busca no banco de dados ou serviço:
    const credits = await fetchUserCredits(userId); // Implementação depende do banco
    return NextResponse.json({ credits });
  } catch (error) {
    console.error("Erro ao buscar créditos:", error);
    return NextResponse.json({ error: "Erro interno ao buscar créditos" }, { status: 500 });
  }
}


