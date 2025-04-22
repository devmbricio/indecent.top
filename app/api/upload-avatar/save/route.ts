// /api/upload-avatar/save.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";  // Exemplo com Prisma

export async function POST(request: Request) {
  try {
    const { userId, imageUrl } = await request.json();

    if (!userId || !imageUrl) {
      return NextResponse.json(
        { error: "userId e imageUrl são obrigatórios." },
        { status: 400 }
      );
    }

    // Atualizar o campo 'image' do usuário no banco de dados
    await prisma.user.update({
      where: { id: userId },  // Encontre o usuário pelo ID
      data: { image: imageUrl },  // Atualize a URL do avatar
    });

    return NextResponse.json({ message: "Avatar atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao salvar a URL no banco de dados:", error);
    return NextResponse.json(
      { error: "Erro ao salvar a URL no banco de dados." },
      { status: 500 }
    );
  }
}
