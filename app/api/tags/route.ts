import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const tag = url.searchParams.get("tag");
  const sort = url.searchParams.get("sort") || "createdAt";
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const pageSize = 10;

  if (!tag) {
    return NextResponse.json({ message: "A tag é obrigatória." }, { status: 400 });
  }

  try {
    const posts = await prisma.post.findMany({
      where: { tags: { has: tag } },
      orderBy: { [sort]: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { user: true },
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    return NextResponse.json({ message: "Erro ao buscar posts." }, { status: 500 });
  }
}

