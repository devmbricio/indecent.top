import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Ajuste o caminho

export async function GET(request: Request) {
  try {
    const latestResult = await prisma.powerballResult.findFirst({
      orderBy: { drawDate: 'desc' },
    });
    return NextResponse.json(latestResult);
  } catch (error) {
    console.error('Erro ao buscar resultados:', error);
    return NextResponse.json({ error: 'Erro ao buscar resultados.' }, { status: 500 });
  }
}