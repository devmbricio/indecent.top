// app/api/keywords/[keyword]/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { keyword: string } }
) {
  const { keyword } = params;

  try {
    const data = await prisma.keyword.findUnique({
      where: {
        slug: keyword,
      },
      include: {
        city: {
          select: {
            slug: true,
            country: {
              select: {
                slug: true,
              },
            },
          },
        },
        country: {
          select: {
            slug: true,
          },
        },
      },
    });

    if (!data) {
      return NextResponse.json({ error: "Palavra-chave não encontrada" }, { status: 404 });
    }

    let countrySlug: string | undefined;
    let citySlug: string | undefined;

    if (data.city) {
      countrySlug = data.city.country.slug;
      citySlug = data.city.slug;
    } else if (data.country) {
      countrySlug = data.country.slug;
      citySlug = 'default-city'; // Você precisará definir uma cidade padrão para o país
    }

    return NextResponse.json({
      data: {
        ...data,
        countrySlug,
        citySlug,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar dados da palavra-chave:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados da palavra-chave" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}