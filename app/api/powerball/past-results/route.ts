// app/api/powerball/past-results/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');

    try {
        const pastResults = await prisma.powerballResult.findMany({
            orderBy: { drawDate: 'desc' },
            take: limit,
        });
        return NextResponse.json(pastResults);
    } catch (error: any) {
        console.error("Erro ao buscar resultados anteriores:", error);
        return NextResponse.json({ error: "Erro ao buscar resultados anteriores." }, { status: 500 });
    }
}