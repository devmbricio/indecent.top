import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ajuste o caminho conforme necessário

export async function GET() {
  try {
    const products = await prisma.product.findMany(); // Supondo que você tenha uma tabela "product" no Prisma
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
  }
}


