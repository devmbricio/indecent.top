import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Prisma para salvar no banco de dados

// Handler para o método POST
export async function POST(req: Request) {
  try {
    const body = await req.json(); // Lê o corpo da requisição
    const { txHash, userId, amount } = body;

    // Validação básica dos campos
    if (!txHash || !userId || !amount) {
      return NextResponse.json({ success: false, message: "Dados inválidos" }, { status: 400 });
    }

    // Registra o pagamento no banco de dados
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount,
        txHash,
        status: "COMPLETED", // Status do pagamento
        date: new Date(),
      },
    });

    // Resposta de sucesso
    return NextResponse.json({ success: true, payment }, { status: 200 });
  } catch (error) {
    console.error("Erro ao registrar pagamento:", error);
    return NextResponse.json({ success: false, message: "Erro ao registrar pagamento" }, { status: 500 });
  }
}

// Handler para métodos não permitidos
export async function OPTIONS() {
  return NextResponse.json({ message: "Método não permitido" }, { status: 405 });
}



/* funcional mas nao gera build


// app/api/crypto-payment/route.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // Prisma para salvar no banco de dados

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { txHash, userId, amount } = req.body;

      // Registra o pagamento no banco de dados
      const payment = await prisma.payment.create({
        data: {
          userId,
          amount,
          txHash,
          status: "COMPLETED", // Status do pagamento
          date: new Date(),
        },
      });

      // Resposta de sucesso
      res.status(200).json({ success: true, payment });
    } catch (error) {
      console.error("Erro ao registrar pagamento:", error);
      res.status(500).json({ success: false, message: "Erro ao registrar pagamento" });
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
*/
