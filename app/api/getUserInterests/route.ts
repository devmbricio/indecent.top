import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ interests: [] }, { status: 401 });
  }

  console.log("🔹 Buscando interesses do usuário:", session.user.email);

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    console.log("🚨 Usuário não encontrado no banco!");
    return NextResponse.json({ interests: [] }, { status: 404 });
  }

  const userInterests = await prisma.userInterest.findMany({
    where: { userId: user.id },
    select: { interest: { select: { name: true } } },
  });

  const interests = userInterests.map((ui) => ui.interest.name);
  console.log("✅ Interesses encontrados:", interests);

  return NextResponse.json({ interests });
}
