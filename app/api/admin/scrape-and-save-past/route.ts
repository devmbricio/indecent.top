// pages/api/admin/scrape-and-save-past.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as cheerio from 'cheerio';
import prisma from '@/lib/prisma';

const POWERBALL_ARCHIVE_URL = "https://www.powerball.com/previous-results";

async function scrapePastPowerballResults() {
    try {
        const response = await axios.get(POWERBALL_ARCHIVE_URL);
        const html = response.data;
        const $ = cheerio.load(html);
        const results: any[] = [];
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
                powerPlay: powerPlay ? [powerPlay] : [], // Salva como array (conforme seu schema)
            });
        });

        return results;
    } catch (error: any) {
        console.error("Erro ao raspar resultados anteriores:", error.message);
        return [];
    }
}

async function savePastResultsToDatabase(results: any[]) {
    try {
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
        return { success: true, message: `${results.length} resultados anteriores salvos/atualizados com sucesso.` };
    } catch (error) {
        console.error("Erro ao salvar resultados no banco de dados:", error);
        return { success: false, message: "Erro ao salvar resultados no banco de dados." };
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // Adicione aqui qualquer lógica de autenticação/autorização para proteger esta rota

        const scrapedResults = await scrapePastPowerballResults();

        if (scrapedResults.length > 0) {
            const saveResult = await savePastResultsToDatabase(scrapedResults);
            res.status(200).json(saveResult);
        } else {
            res.status(500).json({ success: false, message: "Nenhum resultado anterior foi raspado." });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}