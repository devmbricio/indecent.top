// app/api/powerball/admin/scrape-and-save-past/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import prisma from '@/lib/prisma';
import { parse } from 'date-fns';

const POWERBALL_URL = "https://www.powerball.com/";



async function scrapePowerballData() {
    try {
        const response = await axios.get(POWERBALL_URL);
        const html = response.data;
        const $ = cheerio.load(html);
        const results: any[] = [];

        // Raspagem dos resultados anteriores
        const rows = $('.previous-results-table tbody tr');
        rows.each((i, row) => {
            const drawDateText = $(row).find('.draw-date').text().trim();
            const drawDate = new Date(drawDateText);
            const winningNumbers: number[] = [];
            $(row).find('.winning-numbers li').each((_, el) => {
                const numText = $(el).text().trim();
                const num = parseInt(numText, 10);
                if (!isNaN(num)) {
                    winningNumbers.push(num);
                }
            });
            const powerballNumberText = $(row).find('.powerball-number').text().trim();
            const powerballNumber = parseInt(powerballNumberText, 10);
            const powerPlayText = $(row).find('.power-play-number').text().trim();
            const powerPlay = powerPlayText ? parseInt(powerPlayText, 10) : undefined;

            results.push({
                drawDate,
                winningNumbers,
                powerballNumber,
                powerPlay: powerPlay ? [powerPlay] : [],
            });
        });

        // Raspagem das informações do próximo sorteio e prêmio
        const nextDrawDateText = $('.drawing-info__date').text().trim();
           console.log("Data do próximo sorteio raspada:", nextDrawDateText);
        const estimatedJackpot = $('.jackpot__value').text().trim();
        const cashValue = $('.cash-value').text().trim(); // Este pode ou não ter mudado

        return {
            results,
            nextDrawDate: nextDrawDateText,
            estimatedJackpot,
            cashValue,
        };
    } catch (error: any) {
        console.error("Erro ao raspar dados do Powerball:", error.message);
        return { results: [], nextDrawDate: null, estimatedJackpot: null, cashValue: null };
    }
}

async function savePastResultsToDatabase(data: { results: any[], nextDrawDate: string | null, estimatedJackpot: string | null, cashValue: string | null }) {
    try {
        const { results, nextDrawDate, estimatedJackpot, cashValue } = data;

        // Salvar resultados dos sorteios anteriores
        for (const result of results) {
            await prisma.powerballResult.upsert({
                where: { drawDate: result.drawDate },
                update: {
                    winningNumbers: result.winningNumbers,
                    powerballNumber: result.powerballNumber,
                    powerPlay: result.powerPlay,
                },
                create: {
                    drawDate: result.drawDate,
                    winningNumbers: result.winningNumbers,
                    powerballNumber: result.powerballNumber,
                    powerPlay: result.powerPlay,
                },
            });
        }

// Salvar informações do próximo sorteio
if (nextDrawDate) {
    await prisma.nextDraw.upsert({
        where: { id: "1" }, // Converter o número para string
        update: {
            drawDate: new Date(nextDrawDate),
            estimatedJackpot: estimatedJackpot || null,
            cashValue: cashValue || null,
        },
        create: {
            id: "1", // Converter o número para string
            drawDate: new Date(nextDrawDate),
            estimatedJackpot: estimatedJackpot || null,
            cashValue: cashValue || null,
        },
    });
}
        return { success: true, message: `${results.length} resultados anteriores salvos/atualizados com sucesso. Informações do próximo sorteio salvas/atualizadas.` };
    } catch (error) {
        console.error("Erro ao salvar dados no banco de dados:", error);
        return { success: false, message: "Erro ao salvar dados no banco de dados." };
    }
}

export async function POST(request: Request) {
    try {
        // Lógica de raspagem e salvamento
        const scrapedData = await scrapePowerballData();
        const saveResult = await savePastResultsToDatabase(scrapedData);

        if (saveResult.success) {
            return NextResponse.json({ message: saveResult.message, data: scrapedData }, { status: 200 });
        } else {
            return NextResponse.json({ error: saveResult.message }, { status: 500 });
        }
    } catch (error: any) {
        console.error('Erro durante a raspagem e salvamento:', error);
        return NextResponse.json({ error: 'Erro ao raspar e salvar os resultados' }, { status: 500 });
    }
}
