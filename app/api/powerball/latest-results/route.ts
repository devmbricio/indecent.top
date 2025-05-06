// app/api/powerball/latest-results/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const latestResult = await prisma.powerballResult.findFirst({
            orderBy: { drawDate: 'desc' },
        });

        if (latestResult) {
            return NextResponse.json({
                drawDate: latestResult.drawDate.toISOString(),
                winningNumbers: latestResult.winningNumbers,
                powerballNumber: latestResult.powerballNumber,
                powerPlay: latestResult.powerPlay,
            }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Nenhum resultado disponível.' }, { status: 404 });
        }
    } catch (error) {
        console.error('Erro ao buscar os últimos resultados:', error);
        return NextResponse.json({ error: 'Erro ao buscar os últimos resultados.' }, { status: 500 });
    }
}